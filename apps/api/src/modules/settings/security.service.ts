import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ChangePasswordDto, Disable2faDto } from './dto/security.dto';

function generateBackupCodes(count = 8): string[] {
  return Array.from({ length: count }, () => randomBytes(5).toString('hex').toUpperCase());
}

@Injectable()
export class SecurityService {
  constructor(private readonly prisma: PrismaService) {}

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    // Changing your password should kick out every other device.
    await this.prisma.session.updateMany({ where: { userId }, data: { revokedAt: new Date() } });
    return { changed: true };
  }

  // --- Two-factor authentication (TOTP) ---

  /** Step 1: generate a secret + QR code. Not enabled yet until verifySetup() confirms a code. */
  async setupTwoFactor(userId: string, email: string) {
    const secret = authenticator.generateSecret();
    await this.prisma.user.update({ where: { id: userId }, data: { twoFactorSecret: secret } });

    const otpauth = authenticator.keyuri(email, 'Fitness Platform', secret);
    const qrCodeDataUrl = await QRCode.toDataURL(otpauth);
    return { secret, qrCodeDataUrl };
  }

  /** Step 2: user enters a code from their authenticator app to confirm setup. */
  async verifyTwoFactorSetup(userId: string, code: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.twoFactorSecret) throw new BadRequestException('Run 2FA setup first');
    if (!authenticator.check(code, user.twoFactorSecret)) {
      throw new BadRequestException('Incorrect code — check your authenticator app and try again');
    }

    const backupCodes = generateBackupCodes();
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true, backupCodes },
    });
    // Backup codes are shown once, at the moment 2FA is turned on — same pattern GitHub/Google use.
    return { enabled: true, backupCodes };
  }

  async disableTwoFactor(userId: string, dto: Disable2faDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null, backupCodes: [] },
    });
    return { enabled: false };
  }

  async regenerateBackupCodes(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.twoFactorEnabled) throw new BadRequestException('Enable 2FA first');
    const backupCodes = generateBackupCodes();
    await this.prisma.user.update({ where: { id: userId }, data: { backupCodes } });
    return { backupCodes };
  }

  // --- Sessions / devices ---

  findSessions(userId: string, currentSessionId: string | undefined) {
    return this.prisma.session
      .findMany({
        where: { userId, revokedAt: null },
        orderBy: { lastActiveAt: 'desc' },
      })
      .then((sessions) => sessions.map((s) => ({ ...s, isCurrent: s.id === currentSessionId })));
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== userId) throw new ForbiddenException('Not your session');
    await this.prisma.session.update({ where: { id: sessionId }, data: { revokedAt: new Date() } });
    return { revoked: true };
  }

  async revokeOtherSessions(userId: string, currentSessionId: string | undefined) {
    await this.prisma.session.updateMany({
      where: { userId, revokedAt: null, ...(currentSessionId ? { id: { not: currentSessionId } } : {}) },
      data: { revokedAt: new Date() },
    });
    return { revoked: true };
  }

  async setSessionTrusted(userId: string, sessionId: string, trusted: boolean) {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== userId) throw new ForbiddenException('Not your session');
    return this.prisma.session.update({ where: { id: sessionId }, data: { trusted } });
  }

  findLoginHistory(userId: string) {
    return this.prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}

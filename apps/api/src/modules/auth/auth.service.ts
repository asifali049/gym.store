import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailService } from '../../common/email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


const REFRESH_TOKEN_TTL_DAYS = 7;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 12);
    const emailVerifyToken = crypto.randomBytes(32).toString('hex');
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        firstName: dto.firstName,
        lastName: dto.lastName,
        emailVerifyToken: this.hashToken(emailVerifyToken),
      },
    });

    const frontendUrl = process.env.WEB_APP_URL ?? 'http://localhost:3000';
    void this.emailService.sendWelcomeEmail(user.email, user.firstName);
    void this.emailService.sendVerificationEmail(user.email, `${frontendUrl}/verify-email?token=${emailVerifyToken}`);

    return {
      ...(await this.issueTokens(user.id, user.email, user.role)),
      user: this.toSafeUser(user),
    };
  }

  async verifyEmail(token: string) {
    const tokenHash = this.hashToken(token);
    const user = await this.prisma.user.findUnique({ where: { emailVerifyToken: tokenHash } });

    if (!user) throw new BadRequestException('Invalid or expired verification link');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerifyToken: null },
    });

    return { message: 'Email verified successfully.' };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return {
      ...(await this.issueTokens(user.id, user.email, user.role)),
      user: this.toSafeUser(user),
    };
  }

  // Refresh tokens are single-use (rotated): the presented token is revoked
  // and a brand-new access+refresh pair is issued in its place. This limits
  // the damage window if a refresh token is ever leaked.
  async refresh(userId: string, rawToken: string) {
    const tokenHash = this.hashToken(rawToken);
    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });

    if (!stored || stored.revoked || stored.userId !== userId || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Invalid refresh token');

    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });

    return {
      ...(await this.issueTokens(user.id, user.email, user.role)),
      user: this.toSafeUser(user),
    };
  }

  async logout(rawToken: string) {
    const tokenHash = this.hashToken(rawToken);
    await this.prisma.refreshToken.updateMany({ where: { tokenHash }, data: { revoked: true } });
    return { success: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    // Always return the same response whether or not the email exists,
    // so this endpoint can't be used to enumerate registered accounts.
    if (!user) return { message: 'If an account exists, a reset link has been sent.' };

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: tokenHash, passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000) },
    });

    const frontendUrl = process.env.WEB_APP_URL ?? 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
    void this.emailService.sendPasswordResetEmail(user.email, resetUrl);

    return { message: 'If an account exists, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashToken(dto.token);
    const user = await this.prisma.user.findUnique({ where: { passwordResetToken: tokenHash } });

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset link');
    }

    const hashed = await bcrypt.hash(dto.password, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, passwordResetToken: null, passwordResetExpires: null },
    });

    // Revoke all existing sessions so a leaked/old session can't persist past a reset.
    await this.prisma.refreshToken.updateMany({ where: { userId: user.id }, data: { revoked: true } });

    return { message: 'Password has been reset successfully.' };
  }

  private toSafeUser(user: { id: string; email: string; firstName: string; lastName: string; role: string }) {
    return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async issueTokens(sub: string, email: string, role: string) {
    const payload = { sub, email, role };
    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET ?? 'change-me-too',
      expiresIn: `${REFRESH_TOKEN_TTL_DAYS}d`,
    });

    await this.prisma.refreshToken.create({
      data: {
        userId: sub,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }
}

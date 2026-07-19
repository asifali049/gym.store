import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { PrismaService } from '../../common/prisma/prisma.service';

const RP_NAME = process.env.WEBAUTHN_RP_NAME ?? 'Fitness Platform';
const RP_ID = process.env.WEBAUTHN_RP_ID ?? 'localhost';
const ORIGIN = process.env.WEBAUTHN_ORIGIN ?? 'http://localhost:3000';

@Injectable()
export class WebauthnService {
  constructor(private readonly prisma: PrismaService) {}

  async findMine(userId: string) {
    return this.prisma.webAuthnCredential.findMany({
      where: { userId },
      select: { id: true, deviceName: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateRegistration(userId: string, email: string) {
    const existing = await this.prisma.webAuthnCredential.findMany({ where: { userId } });

    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userName: email,
      attestationType: 'none',
      excludeCredentials: existing.map((c) => ({ id: c.credentialId })),
      authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred' },
    });

    await this.prisma.user.update({ where: { id: userId }, data: { webauthnChallenge: options.challenge } });
    return options;
  }

  async verifyRegistration(userId: string, deviceName: string | undefined, response: any) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.webauthnChallenge) throw new BadRequestException('No passkey registration in progress');

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: user.webauthnChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      throw new BadRequestException('Passkey verification failed');
    }

    const { credential } = verification.registrationInfo;
    await this.prisma.$transaction([
      this.prisma.webAuthnCredential.create({
        data: {
          userId,
          credentialId: credential.id,
          publicKey: Buffer.from(credential.publicKey).toString('base64url'),
          counter: credential.counter,
          deviceName: deviceName ?? 'Passkey',
        },
      }),
      this.prisma.user.update({ where: { id: userId }, data: { webauthnChallenge: null } }),
    ]);

    return { verified: true };
  }

  async removeCredential(userId: string, id: string) {
    const credential = await this.prisma.webAuthnCredential.findUnique({ where: { id } });
    if (!credential || credential.userId !== userId) throw new ForbiddenException('Not your passkey');
    await this.prisma.webAuthnCredential.delete({ where: { id } });
    return { removed: true };
  }

  // --- Passwordless login with an existing passkey ---

  async generateAuthentication(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { webauthnCredentials: true },
    });
    if (!user || user.webauthnCredentials.length === 0) {
      throw new BadRequestException('No passkeys registered for this account');
    }

    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      allowCredentials: user.webauthnCredentials.map((c) => ({ id: c.credentialId })),
      userVerification: 'preferred',
    });

    await this.prisma.user.update({ where: { id: user.id }, data: { webauthnChallenge: options.challenge } });
    return { userId: user.id, options };
  }

  async verifyAuthentication(userId: string, response: any) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.webauthnChallenge) throw new BadRequestException('No passkey login in progress');

    const credential = await this.prisma.webAuthnCredential.findUnique({
      where: { credentialId: response.id },
    });
    if (!credential || credential.userId !== userId) throw new UnauthorizedException('Unknown passkey');

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: user.webauthnChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      credential: {
        id: credential.credentialId,
        publicKey: Buffer.from(credential.publicKey, 'base64url'),
        counter: credential.counter,
      },
    });

    if (!verification.verified) throw new UnauthorizedException('Passkey verification failed');

    await this.prisma.$transaction([
      this.prisma.webAuthnCredential.update({
        where: { id: credential.id },
        data: { counter: verification.authenticationInfo.newCounter },
      }),
      this.prisma.user.update({ where: { id: userId }, data: { webauthnChallenge: null } }),
    ]);

    return { verified: true };
  }
}

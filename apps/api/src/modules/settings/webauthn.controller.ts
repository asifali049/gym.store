import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { WebauthnService } from './webauthn.service';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

type Me = { userId: string; email: string };

@ApiTags('settings/security/passkeys')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('settings/security/passkeys')
export class WebauthnController {
  constructor(
    private readonly webauthnService: WebauthnService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  findMine(@CurrentUser() user: Me) {
    return this.webauthnService.findMine(user.userId);
  }

  @Post('register/options')
  generateRegistration(@CurrentUser() user: Me) {
    return this.webauthnService.generateRegistration(user.userId, user.email);
  }

  @Post('register/verify')
  verifyRegistration(@CurrentUser() user: Me, @Body() body: { deviceName?: string; response: any }) {
    return this.webauthnService.verifyRegistration(user.userId, body.deviceName, body.response);
  }

  @Delete(':id')
  remove(@CurrentUser() user: Me, @Param('id') id: string) {
    return this.webauthnService.removeCredential(user.userId, id);
  }
}

// Passwordless login lives outside the auth guard (no token yet) but stays close to
// the rest of the WebAuthn flow, so it's registered alongside WebauthnController
// in SettingsModule rather than duplicated under AuthModule.
@ApiTags('auth/passkey')
@Controller('auth/passkey')
export class PasskeyLoginController {
  constructor(
    private readonly webauthnService: WebauthnService,
    private readonly authService: AuthService,
  ) {}

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('login/options')
  generateAuthentication(@Body('email') email: string) {
    return this.webauthnService.generateAuthentication(email);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('login/verify')
  async verifyAuthentication(@Body() body: { userId: string; response: any }, @Req() req: Request) {
    await this.webauthnService.verifyAuthentication(body.userId, body.response);
    return this.authService.issueTokensForVerifiedUser(body.userId, {
      ipAddress: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.ip,
      userAgent: req.headers['user-agent'],
    });
  }
}

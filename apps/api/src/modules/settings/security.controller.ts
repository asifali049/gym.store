import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SecurityService } from './security.service';
import { ChangePasswordDto, Disable2faDto, Verify2faDto } from './dto/security.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

type Me = { userId: string; email: string; sessionId?: string };

@ApiTags('settings/security')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('settings/security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Patch('password')
  changePassword(@CurrentUser() user: Me, @Body() dto: ChangePasswordDto) {
    return this.securityService.changePassword(user.userId, dto);
  }

  @Post('2fa/setup')
  setupTwoFactor(@CurrentUser() user: Me) {
    return this.securityService.setupTwoFactor(user.userId, user.email);
  }

  @Post('2fa/verify')
  verifyTwoFactorSetup(@CurrentUser() user: Me, @Body() dto: Verify2faDto) {
    return this.securityService.verifyTwoFactorSetup(user.userId, dto.code);
  }

  @Post('2fa/disable')
  disableTwoFactor(@CurrentUser() user: Me, @Body() dto: Disable2faDto) {
    return this.securityService.disableTwoFactor(user.userId, dto);
  }

  @Post('2fa/backup-codes')
  regenerateBackupCodes(@CurrentUser() user: Me) {
    return this.securityService.regenerateBackupCodes(user.userId);
  }

  @Get('sessions')
  findSessions(@CurrentUser() user: Me) {
    return this.securityService.findSessions(user.userId, user.sessionId);
  }

  @Delete('sessions/:id')
  revokeSession(@CurrentUser() user: Me, @Param('id') id: string) {
    return this.securityService.revokeSession(user.userId, id);
  }

  @Post('sessions/revoke-others')
  revokeOtherSessions(@CurrentUser() user: Me) {
    return this.securityService.revokeOtherSessions(user.userId, user.sessionId);
  }

  @Patch('sessions/:id/trust')
  trustSession(@CurrentUser() user: Me, @Param('id') id: string, @Body('trusted') trusted: boolean) {
    return this.securityService.setSessionTrusted(user.userId, id, trusted);
  }

  @Get('login-history')
  findLoginHistory(@CurrentUser() user: Me) {
    return this.securityService.findLoginHistory(user.userId);
  }
}

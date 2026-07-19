import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto, UpdateAvatarDto, UpdateSecurityPrefsDto } from './dto/profile.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('settings/profile')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('settings/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findMe(@CurrentUser() user: { userId: string }) {
    return this.profileService.findMe(user.userId);
  }

  @Patch()
  update(@CurrentUser() user: { userId: string }, @Body() dto: UpdateProfileDto) {
    return this.profileService.update(user.userId, dto);
  }

  @Patch('avatar')
  updateAvatar(@CurrentUser() user: { userId: string }, @Body() dto: UpdateAvatarDto) {
    return this.profileService.updateAvatar(user.userId, dto);
  }

  @Patch('security-preferences')
  updateSecurityPrefs(@CurrentUser() user: { userId: string }, @Body() dto: UpdateSecurityPrefsDto) {
    return this.profileService.updateSecurityPrefs(user.userId, dto);
  }

  @Get('export')
  exportData(@CurrentUser() user: { userId: string }) {
    return this.profileService.exportData(user.userId);
  }

  @Delete()
  deleteAccount(@CurrentUser() user: { userId: string }) {
    return this.profileService.deleteAccount(user.userId);
  }
}

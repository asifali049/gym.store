import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PreferencesService } from './preferences.service';
import { PrivacySettingsDto } from './dto/privacy.dto';
import { NotificationSettingsDto } from './dto/notifications.dto';
import { AppearanceSettingsDto } from './dto/appearance.dto';
import { AccessibilitySettingsDto } from './dto/accessibility.dto';
import { ShoppingPreferencesDto } from './dto/shopping.dto';
import { FitnessPreferencesDto } from './dto/fitness.dto';
import { AiPreferencesDto } from './dto/ai-preferences.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

type Me = { userId: string };

@ApiTags('settings/preferences')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('settings/preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  findAll(@CurrentUser() user: Me) {
    return this.preferencesService.findAll(user.userId);
  }

  @Patch('privacy')
  updatePrivacy(@CurrentUser() user: Me, @Body() dto: PrivacySettingsDto) {
    return this.preferencesService.updateSection(user.userId, 'privacy', dto);
  }

  @Patch('notifications')
  updateNotifications(@CurrentUser() user: Me, @Body() dto: NotificationSettingsDto) {
    return this.preferencesService.updateSection(user.userId, 'notifications', dto);
  }

  @Patch('appearance')
  updateAppearance(@CurrentUser() user: Me, @Body() dto: AppearanceSettingsDto) {
    return this.preferencesService.updateSection(user.userId, 'appearance', dto);
  }

  @Patch('accessibility')
  updateAccessibility(@CurrentUser() user: Me, @Body() dto: AccessibilitySettingsDto) {
    return this.preferencesService.updateSection(user.userId, 'accessibility', dto);
  }

  @Patch('shopping')
  updateShopping(@CurrentUser() user: Me, @Body() dto: ShoppingPreferencesDto) {
    return this.preferencesService.updateSection(user.userId, 'shopping', dto);
  }

  @Patch('fitness')
  updateFitness(@CurrentUser() user: Me, @Body() dto: FitnessPreferencesDto) {
    return this.preferencesService.updateSection(user.userId, 'fitness', dto);
  }

  @Patch('ai')
  updateAi(@CurrentUser() user: Me, @Body() dto: AiPreferencesDto) {
    return this.preferencesService.updateSection(user.userId, 'ai', dto);
  }
}

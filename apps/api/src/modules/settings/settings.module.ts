import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { WebauthnController, PasskeyLoginController } from './webauthn.controller';
import { WebauthnService } from './webauthn.service';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';

@Module({
  imports: [AuthModule],
  controllers: [
    ProfileController,
    SecurityController,
    WebauthnController,
    PasskeyLoginController,
    PreferencesController,
  ],
  providers: [ProfileService, SecurityService, WebauthnService, PreferencesService],
})
export class SettingsModule {}

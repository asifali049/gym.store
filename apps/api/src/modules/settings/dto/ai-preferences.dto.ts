import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class AiPreferencesDto {
  @IsOptional() @IsBoolean() aiCoachEnabled?: boolean;
  @IsOptional() @IsBoolean() aiRecommendations?: boolean;
  @IsOptional() @IsBoolean() personalizedDiet?: boolean;
  @IsOptional() @IsBoolean() personalizedWorkout?: boolean;
  @IsOptional() @IsBoolean() aiChatHistory?: boolean;
  @IsOptional() @IsBoolean() voiceAssistant?: boolean;
  @IsOptional() @IsIn(['minimal', 'normal', 'frequent']) aiNotificationLevel?: string;
  @IsOptional() @IsBoolean() aiMemory?: boolean;
  @IsOptional() @IsBoolean() aiSuggestions?: boolean;
  @IsOptional() @IsString() aiLanguage?: string;
}

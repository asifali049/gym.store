import { IsBoolean, IsIn, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class AccessibilitySettingsDto {
  @IsOptional() @IsBoolean() screenReaderSupport?: boolean;
  @IsOptional() @IsBoolean() highContrast?: boolean;
  @IsOptional() @IsBoolean() keyboardNavigation?: boolean;
  @IsOptional() @IsBoolean() focusRing?: boolean;
  @IsOptional() @IsBoolean() dyslexiaFont?: boolean;
  @IsOptional() @IsNumber() @Min(80) @Max(200) textScalingPercent?: number;
  @IsOptional() @IsBoolean() motionReduction?: boolean;
  @IsOptional() @IsBoolean() voiceNavigation?: boolean;
  @IsOptional() @IsIn(['none', 'protanopia', 'deuteranopia', 'tritanopia']) colorBlindMode?: string;
  @IsOptional() @IsBoolean() captions?: boolean;
  @IsOptional() @IsBoolean() readingMode?: boolean;
}

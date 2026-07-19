import { IsBoolean, IsIn, IsOptional, IsString, Matches } from 'class-validator';

export class AppearanceSettingsDto {
  @IsOptional() @IsIn(['light', 'dark', 'system']) theme?: 'light' | 'dark' | 'system';
  @IsOptional() @Matches(/^#[0-9a-fA-F]{6}$/) accentColor?: string;
  @IsOptional() @IsIn(['sm', 'md', 'lg']) fontSize?: 'sm' | 'md' | 'lg';
  @IsOptional() @IsIn(['none', 'reduced', 'full']) animationLevel?: 'none' | 'reduced' | 'full';
  @IsOptional() @IsBoolean() reduceMotion?: boolean;
  @IsOptional() @IsBoolean() compactMode?: boolean;
  @IsOptional() @IsBoolean() largeUI?: boolean;
  @IsOptional() @IsIn(['none', 'sm', 'md', 'lg', 'full']) borderRadius?: string;
  @IsOptional() @IsBoolean() glassEffects?: boolean;
  @IsOptional() @IsBoolean() cursorEffects?: boolean;
}

import { ArrayMaxSize, IsArray, IsBoolean, IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class FitnessPreferencesDto {
  @IsOptional()
  @IsIn(['muscle_gain', 'weight_loss', 'strength', 'endurance', 'fat_loss'])
  goal?: string;

  @IsOptional() @IsString() workoutType?: string;
  @IsOptional() @IsString() dietType?: string;
  @IsOptional() @IsArray() @ArrayMaxSize(20) @IsString({ each: true }) allergies?: string[];
  @IsOptional() @IsString() medicalRestrictions?: string;
  @IsOptional() @IsNumber() @Min(0) proteinTargetG?: number;
  @IsOptional() @IsNumber() @Min(0) caloriesTarget?: number;
  @IsOptional() @IsNumber() @Min(0) waterGoalMl?: number;
  @IsOptional() @IsNumber() @Min(0) sleepGoalHours?: number;
  @IsOptional() @IsBoolean() workoutReminder?: boolean;
  @IsOptional() @IsBoolean() supplementReminder?: boolean;
}

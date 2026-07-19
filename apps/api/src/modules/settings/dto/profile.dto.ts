import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender, FitnessLevel, UnitsPreference } from '@prisma/client';

export class UpdateProfileDto {
  @IsOptional() @IsString() @MaxLength(60) firstName?: string;
  @IsOptional() @IsString() @MaxLength(60) lastName?: string;
  @IsOptional() @IsString() @MaxLength(60) displayName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(24)
  @Matches(/^[a-z0-9_.]+$/, { message: 'Username can only contain lowercase letters, numbers, _ and .' })
  username?: string;

  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsEnum(Gender) gender?: Gender;
  @IsOptional() @IsEnum(FitnessLevel) fitnessLevel?: FitnessLevel;
  @IsOptional() @IsString() @MaxLength(80) occupation?: string;
  @IsOptional() @IsString() @MaxLength(60) emergencyContactName?: string;
  @IsOptional() @IsString() emergencyContactPhone?: string;
  @IsOptional() @IsString() language?: string;
  @IsOptional() @IsString() timezone?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsEnum(UnitsPreference) units?: UnitsPreference;
  @IsOptional() @IsNumber() heightCm?: number;
  @IsOptional() @IsNumber() weightKg?: number;
  @IsOptional() @IsString() @MaxLength(10) bloodGroup?: string;
}

export class UpdateAvatarDto {
  @IsString()
  profilePictureUrl: string;
}

export class UpdateSecurityPrefsDto {
  @IsOptional() @IsNumber() sessionTimeoutMins?: number;
  @IsOptional() @IsBoolean() autoLogoutEnabled?: boolean;
}

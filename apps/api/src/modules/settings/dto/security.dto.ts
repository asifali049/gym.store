import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class Verify2faDto {
  @IsString()
  @MinLength(6)
  code: string;
}

export class Disable2faDto {
  @IsString()
  currentPassword: string;
}

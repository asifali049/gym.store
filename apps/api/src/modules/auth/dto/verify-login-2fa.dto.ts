import { IsString, MinLength } from 'class-validator';

export class VerifyLoginTwoFactorDto {
  @IsString()
  userId: string;

  @IsString()
  @MinLength(6)
  code: string;
}

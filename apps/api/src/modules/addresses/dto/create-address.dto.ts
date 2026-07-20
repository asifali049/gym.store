import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  line1: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  pincode: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

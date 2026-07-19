import { ArrayMaxSize, IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class ShoppingPreferencesDto {
  @IsOptional() @IsString() defaultAddressId?: string;
  @IsOptional() @IsString() billingAddressId?: string;
  @IsOptional() @IsString() preferredCourier?: string;
  @IsOptional() @IsString() preferredDeliveryTime?: string;
  @IsOptional() @IsString() defaultPaymentMethod?: string;
  @IsOptional() @IsBoolean() saveCards?: boolean;
  @IsOptional() @IsBoolean() autoApplyCoupons?: boolean;
  @IsOptional() @IsArray() @ArrayMaxSize(20) @IsString({ each: true }) favoriteCategories?: string[];
  @IsOptional() @IsArray() @ArrayMaxSize(20) @IsString({ each: true }) favoriteBrands?: string[];
}

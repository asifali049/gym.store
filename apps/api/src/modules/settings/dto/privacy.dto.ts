import { IsBoolean, IsIn, IsOptional } from 'class-validator';

export class PrivacySettingsDto {
  @IsOptional() @IsBoolean() publicProfile?: boolean;
  @IsOptional() @IsBoolean() hideWeight?: boolean;
  @IsOptional() @IsBoolean() hideProgress?: boolean;
  @IsOptional() @IsBoolean() hideOrders?: boolean;
  @IsOptional() @IsBoolean() hideWishlist?: boolean;
  @IsOptional() @IsBoolean() hideReviews?: boolean;
  @IsOptional() @IsBoolean() hideActivity?: boolean;
  @IsOptional() @IsBoolean() searchVisibility?: boolean;
  @IsOptional() @IsBoolean() dataSharing?: boolean;
  @IsOptional() @IsBoolean() personalizedAds?: boolean;
  @IsOptional() @IsBoolean() aiDataUsage?: boolean;
  @IsOptional() @IsIn(['essential', 'all']) cookiePreferences?: 'essential' | 'all';
  @IsOptional() @IsBoolean() analyticsConsent?: boolean;
}

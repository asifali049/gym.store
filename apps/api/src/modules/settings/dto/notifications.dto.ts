import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class EmailNotificationsDto {
  @IsOptional() @IsBoolean() orders?: boolean;
  @IsOptional() @IsBoolean() shipping?: boolean;
  @IsOptional() @IsBoolean() refunds?: boolean;
  @IsOptional() @IsBoolean() offers?: boolean;
  @IsOptional() @IsBoolean() newsletter?: boolean;
  @IsOptional() @IsBoolean() blog?: boolean;
  @IsOptional() @IsBoolean() workoutReminder?: boolean;
  @IsOptional() @IsBoolean() dietReminder?: boolean;
}

class PushNotificationsDto {
  @IsOptional() @IsBoolean() promotions?: boolean;
  @IsOptional() @IsBoolean() flashSales?: boolean;
  @IsOptional() @IsBoolean() wishlist?: boolean;
  @IsOptional() @IsBoolean() priceDrop?: boolean;
  @IsOptional() @IsBoolean() orderUpdates?: boolean;
  @IsOptional() @IsBoolean() aiCoach?: boolean;
}

class SmsNotificationsDto {
  @IsOptional() @IsBoolean() otp?: boolean;
  @IsOptional() @IsBoolean() order?: boolean;
  @IsOptional() @IsBoolean() delivery?: boolean;
  @IsOptional() @IsBoolean() refund?: boolean;
}

class WhatsappNotificationsDto {
  @IsOptional() @IsBoolean() orderUpdates?: boolean;
  @IsOptional() @IsBoolean() promotions?: boolean;
  @IsOptional() @IsBoolean() support?: boolean;
}

export class NotificationSettingsDto {
  @IsOptional() @ValidateNested() @Type(() => EmailNotificationsDto) email?: EmailNotificationsDto;
  @IsOptional() @ValidateNested() @Type(() => PushNotificationsDto) push?: PushNotificationsDto;
  @IsOptional() @ValidateNested() @Type(() => SmsNotificationsDto) sms?: SmsNotificationsDto;
  @IsOptional() @ValidateNested() @Type(() => WhatsappNotificationsDto) whatsapp?: WhatsappNotificationsDto;
}

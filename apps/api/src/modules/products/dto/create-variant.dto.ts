import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateVariantDto {
  @IsOptional()
  @IsString()
  flavor?: string;

  @IsOptional()
  @IsString()
  weight?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsString()
  sku: string;
}

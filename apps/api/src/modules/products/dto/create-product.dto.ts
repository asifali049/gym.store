import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsString()
  brandId: string;

  @IsString()
  categoryId: string;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

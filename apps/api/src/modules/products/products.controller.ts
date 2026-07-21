import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
  ) {
    return this.productsService.findAll({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      categorySlug: category,
      brandSlug: brand,
    });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN', 'SUPER_ADMIN')
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN', 'SUPER_ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN', 'SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/variants')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN', 'SUPER_ADMIN')
  addVariant(@Param('id') id: string, @Body() dto: CreateVariantDto) {
    return this.productsService.addVariant(id, dto);
  }

  @Patch('variants/:variantId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN', 'SUPER_ADMIN')
  updateVariant(@Param('variantId') variantId: string, @Body() dto: UpdateVariantDto) {
    return this.productsService.updateVariant(variantId, dto);
  }

  @Delete('variants/:variantId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN', 'SUPER_ADMIN')
  removeVariant(@Param('variantId') variantId: string) {
    return this.productsService.removeVariant(variantId);
  }
}
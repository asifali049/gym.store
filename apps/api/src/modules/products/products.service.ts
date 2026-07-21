import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(params: { skip?: number; take?: number; categorySlug?: string; brandSlug?: string }) {
    const where: Prisma.ProductWhereInput = {};
    if (params.categorySlug) where.category = { slug: params.categorySlug };
    if (params.brandSlug) where.brand = { slug: params.brandSlug };

    return this.prisma.product.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: { brand: true, category: true, variants: true },
      skip: params.skip,
      take: params.take ?? 20,
    });
  }

  findBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: { brand: true, category: true, variants: true, reviews: true },
    });
  }

  async create(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Product slug already exists');
    return this.prisma.product.create({ data: { ...dto, images: dto.images ?? [] } });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.assertExists(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.assertExists(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async addVariant(productId: string, dto: CreateVariantDto) {
    await this.assertExists(productId);
    const existingSku = await this.prisma.productVariant.findUnique({ where: { sku: dto.sku } });
    if (existingSku) throw new ConflictException('SKU already exists');
    return this.prisma.productVariant.create({ data: { ...dto, productId } });
  }

  async updateVariant(variantId: string, dto: UpdateVariantDto) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) throw new NotFoundException('Variant not found');
    return this.prisma.productVariant.update({ where: { id: variantId }, data: dto });
  }

  async removeVariant(variantId: string) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) throw new NotFoundException('Variant not found');
    return this.prisma.productVariant.delete({ where: { id: variantId } });
  }

  private async assertExists(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
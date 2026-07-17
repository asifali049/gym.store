import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(params: { skip?: number; take?: number; categorySlug?: string }) {
    return this.prisma.product.findMany({
      where: params.categorySlug ? { category: { slug: params.categorySlug } } : undefined,
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
}

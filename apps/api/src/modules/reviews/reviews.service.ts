import { Injectable, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
  }

  async create(userId: string, dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    // One review per user per product — verified purchase workflows can extend this later
    const existing = await this.prisma.review.findFirst({ where: { userId, productId: dto.productId } });
    if (existing) throw new ConflictException('You already reviewed this product');

    return this.prisma.review.create({
      data: { userId, productId: dto.productId, rating: dto.rating, comment: dto.comment },
    });
  }

  async remove(userId: string, id: string, role: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Not your review');
    }
    return this.prisma.review.delete({ where: { id } });
  }
}

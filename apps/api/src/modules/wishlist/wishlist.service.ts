import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  findMine(userId: string) {
    return this.prisma.wishlist.findMany({ where: { userId } });
  }

  async add(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.prisma.wishlist.findFirst({ where: { userId, productId } });
    if (existing) throw new ConflictException('Product already in wishlist');

    return this.prisma.wishlist.create({ data: { userId, productId } });
  }

  async remove(userId: string, id: string) {
    const item = await this.prisma.wishlist.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Wishlist item not found');
    if (item.userId !== userId) throw new ForbiddenException('Not your wishlist item');
    return this.prisma.wishlist.delete({ where: { id } });
  }
}

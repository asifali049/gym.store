import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CouponsService } from '../coupons/coupons.service';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly couponsService: CouponsService,
  ) {}

  async checkout(userId: string, dto: CheckoutDto) {
    const address = await this.prisma.address.findUnique({ where: { id: dto.addressId } });
    if (!address || address.userId !== userId) {
      throw new ForbiddenException('Invalid delivery address');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { variant: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Verify stock and compute total inside a transaction to avoid race conditions
    return this.prisma.$transaction(async (tx) => {
      let total = 0;

      for (const item of cart.items) {
        const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } });
        if (!variant || variant.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for item ${item.variantId}`);
        }
        total += Number(variant.price) * item.quantity;
      }

      let finalTotal = total;
      if (dto.couponCode) {
        const applied = await this.couponsService.validateAndCompute({
          code: dto.couponCode,
          cartTotal: total,
        });
        finalTotal = applied.finalTotal;
        await this.couponsService.incrementUsage(dto.couponCode);
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalAmount: finalTotal,
          status: 'PENDING',
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.variant.price,
            })),
          },
        },
        include: { items: true },
      });

      // Decrement stock
      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });
  }

  async findMine(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { variant: { include: { product: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, orderId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { variant: { include: { product: true } } } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Not your order');
    }
    return order;
  }

  async updateStatus(orderId: string, status: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    return this.prisma.order.update({ where: { id: orderId }, data: { status } });
  }
}

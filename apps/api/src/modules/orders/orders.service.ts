import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CouponsService } from '../coupons/coupons.service';
import { RazorpayService } from '../../common/payments/razorpay.service';
import { CheckoutDto } from './dto/checkout.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly couponsService: CouponsService,
    private readonly razorpay: RazorpayService,
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

    // Reserve stock and compute total inside a transaction. Stock is decremented with a
    // conditional atomic UPDATE (`WHERE stock >= quantity`) instead of a separate
    // read-then-write, so two concurrent checkouts can never both pass the check and
    // push stock negative — the DB guarantees only one of them can win the row.
    const order = await this.prisma.$transaction(async (tx) => {
      let total = 0;

      for (const item of cart.items) {
        const result = await tx.productVariant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });

        if (result.count === 0) {
          throw new BadRequestException(`Insufficient stock for item ${item.variantId}`);
        }

        total += Number(item.variant.price) * item.quantity;
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

      const created = await tx.order.create({
        data: {
          userId,
          totalAmount: finalTotal,
          status: OrderStatus.PENDING,
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

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    // Payment initiation is a network call, so it happens after the DB transaction has
    // committed rather than inside it (an external call shouldn't hold DB row locks).
    if (!this.razorpay.isConfigured) {
      return { order, payment: null };
    }

    const amountInPaise = Math.round(Number(order.totalAmount) * 100);
    const razorpayOrder = await this.razorpay.createOrder(amountInPaise, order.id);

    const payment = await this.prisma.payment.create({
      data: {
        orderId: order.id,
        providerOrderId: razorpayOrder.id,
        amount: order.totalAmount,
        status: PaymentStatus.CREATED,
      },
    });

    return {
      order,
      payment: {
        razorpayOrderId: payment.providerOrderId,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID!,
        amount: amountInPaise,
      },
    };
  }

  async verifyPayment(userId: string, orderId: string, dto: VerifyPaymentDto) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { payment: true } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Not your order');
    if (!order.payment) throw new BadRequestException('No payment was initiated for this order');

    const valid = this.razorpay.verifySignature(
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature,
    );
    if (!valid || order.payment.providerOrderId !== dto.razorpayOrderId) {
      await this.prisma.payment.update({
        where: { orderId },
        data: { status: PaymentStatus.FAILED },
      });
      throw new BadRequestException('Payment verification failed');
    }

    await this.prisma.payment.update({
      where: { orderId },
      data: { status: PaymentStatus.SUCCEEDED, providerPaymentId: dto.razorpayPaymentId },
    });

    return this.prisma.order.update({ where: { id: orderId }, data: { status: OrderStatus.PAID } });
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
      include: {
        items: { include: { variant: { include: { product: true } } } },
        payment: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Not your order');
    }
    return order;
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    return this.prisma.order.update({ where: { id: orderId }, data: { status } });
  }
}

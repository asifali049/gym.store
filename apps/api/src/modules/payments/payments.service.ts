import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RazorpayService } from '../../common/payments/razorpay.service';
import { EmailService } from '../../common/email/email.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly razorpay: RazorpayService,
    private readonly emailService: EmailService,
  ) {}

  async createPaymentOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { user: true } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Not your order');
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('This order is not awaiting payment');
    }

    const amountInPaise = Math.round(Number(order.totalAmount) * 100);
    const razorpayOrder = await this.razorpay.createOrder(amountInPaise, order.id);

    const payment = await this.prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'RAZORPAY',
        providerOrderId: razorpayOrder.id,
        amount: order.totalAmount,
      },
    });

    return {
      paymentId: payment.id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    };
  }

  async verifyPayment(userId: string, dto: VerifyPaymentDto) {
    const order = await this.prisma.order.findUnique({ where: { id: dto.orderId }, include: { user: true } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Not your order');

    const isValid = this.razorpay.verifySignature(dto.razorpayOrderId, dto.razorpayPaymentId, dto.razorpaySignature);
    if (!isValid) {
      await this.prisma.payment.updateMany({
        where: { providerOrderId: dto.razorpayOrderId },
        data: { status: PaymentStatus.FAILED },
      });
      throw new BadRequestException('Payment signature verification failed');
    }

    await this.prisma.payment.updateMany({
      where: { providerOrderId: dto.razorpayOrderId },
      data: { status: PaymentStatus.SUCCESS, providerPaymentId: dto.razorpayPaymentId },
    });

    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.CONFIRMED },
    });

    void this.emailService.sendOrderConfirmationEmail(order.user.email, order.id, Number(order.totalAmount));

    return updatedOrder;
  }
}

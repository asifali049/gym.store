import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreateCouponDto) {
    const existing = await this.prisma.coupon.findUnique({ where: { code: dto.code } });
    if (existing) throw new ConflictException('Coupon code already exists');

    return this.prisma.coupon.create({
      data: {
        code: dto.code.toUpperCase(),
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        minOrderValue: dto.minOrderValue,
        maxUses: dto.maxUses,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });
  }

  async validateAndCompute(dto: ApplyCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code: dto.code.toUpperCase() } });
    if (!coupon || !coupon.isActive) throw new NotFoundException('Invalid or inactive coupon');

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestException('Coupon has expired');
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('Coupon usage limit reached');
    }
    if (coupon.minOrderValue && dto.cartTotal < Number(coupon.minOrderValue)) {
      throw new BadRequestException(`Minimum order value of ${coupon.minOrderValue} required`);
    }

    const discount =
      coupon.discountType === 'PERCENTAGE'
        ? (dto.cartTotal * Number(coupon.discountValue)) / 100
        : Number(coupon.discountValue);

    return {
      code: coupon.code,
      discount: Math.min(discount, dto.cartTotal),
      finalTotal: Math.max(dto.cartTotal - discount, 0),
    };
  }

  async incrementUsage(code: string) {
    return this.prisma.coupon.update({
      where: { code: code.toUpperCase() },
      data: { usedCount: { increment: 1 } },
    });
  }
}

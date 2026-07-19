import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateProfileDto, UpdateAvatarDto, UpdateSecurityPrefsDto } from './dto/profile.dto';

const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  displayName: true,
  username: true,
  profilePictureUrl: true,
  phone: true,
  role: true,
  emailVerified: true,
  dateOfBirth: true,
  gender: true,
  fitnessLevel: true,
  occupation: true,
  emergencyContactName: true,
  emergencyContactPhone: true,
  language: true,
  timezone: true,
  country: true,
  currency: true,
  units: true,
  heightCm: true,
  weightKg: true,
  bloodGroup: true,
  twoFactorEnabled: true,
  sessionTimeoutMins: true,
  autoLogoutEnabled: true,
  loyaltyPoints: true,
  referralCode: true,
  createdAt: true,
} as const;

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  findMe(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId }, select: PUBLIC_USER_SELECT });
  }

  async update(userId: string, dto: UpdateProfileDto) {
    if (dto.username) {
      const existing = await this.prisma.user.findUnique({ where: { username: dto.username } });
      if (existing && existing.id !== userId) throw new ConflictException('Username already taken');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { ...dto, dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined },
      select: PUBLIC_USER_SELECT,
    });
  }

  // Accepts a URL the client already uploaded to (e.g. ImageKit's client-side upload
  // widget — see IMAGEKIT_* env vars). This app doesn't run its own file storage, so
  // there's no multipart upload endpoint here by design.
  updateAvatar(userId: string, dto: UpdateAvatarDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { profilePictureUrl: dto.profilePictureUrl },
      select: PUBLIC_USER_SELECT,
    });
  }

  updateSecurityPrefs(userId: string, dto: UpdateSecurityPrefsDto) {
    return this.prisma.user.update({ where: { id: userId }, data: dto, select: PUBLIC_USER_SELECT });
  }

  async exportData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
        orders: { include: { items: true } },
        wishlist: true,
        reviews: true,
        preferences: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { password, twoFactorSecret, backupCodes, ...safe } = user;
    return safe;
  }

  async deleteAccount(userId: string) {
    // Hard-deletes the account and everything that references it. Order.userId is a
    // required (non-nullable) foreign key in this schema, so orders must go too rather
    // than being orphaned — in a real store you'd more likely anonymize past orders
    // instead of deleting them, to satisfy tax/accounting retention rules, but that's
    // a business decision this app doesn't need to make on your behalf.
    const orders = await this.prisma.order.findMany({ where: { userId }, select: { id: true } });
    const orderIds = orders.map((o) => o.id);

    await this.prisma.$transaction([
      this.prisma.cartItem.deleteMany({ where: { cart: { userId } } }),
      this.prisma.cart.deleteMany({ where: { userId } }),
      this.prisma.wishlist.deleteMany({ where: { userId } }),
      this.prisma.review.deleteMany({ where: { userId } }),
      this.prisma.address.deleteMany({ where: { userId } }),
      this.prisma.session.deleteMany({ where: { userId } }),
      this.prisma.loginHistory.deleteMany({ where: { userId } }),
      this.prisma.webAuthnCredential.deleteMany({ where: { userId } }),
      this.prisma.linkedAccount.deleteMany({ where: { userId } }),
      this.prisma.apiKey.deleteMany({ where: { userId } }),
      this.prisma.webhook.deleteMany({ where: { userId } }),
      this.prisma.connectedApp.deleteMany({ where: { userId } }),
      this.prisma.pointsTransaction.deleteMany({ where: { userId } }),
      this.prisma.userPreferences.deleteMany({ where: { userId } }),
      this.prisma.payment.deleteMany({ where: { orderId: { in: orderIds } } }),
      this.prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } }),
      this.prisma.order.deleteMany({ where: { userId } }),
      this.prisma.user.delete({ where: { id: userId } }),
    ]);
    return { deleted: true };
  }
}

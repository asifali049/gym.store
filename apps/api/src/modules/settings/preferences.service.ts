import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

type PrefSection = 'privacy' | 'notifications' | 'appearance' | 'accessibility' | 'shopping' | 'fitness' | 'ai';

const DEFAULTS: Record<PrefSection, object> = {
  privacy: {},
  notifications: {
    email: { orders: true, shipping: true, refunds: true, offers: false, newsletter: false, blog: false, workoutReminder: false, dietReminder: false },
    push: { promotions: false, flashSales: false, wishlist: true, priceDrop: true, orderUpdates: true, aiCoach: true },
    sms: { otp: true, order: true, delivery: true, refund: true },
    whatsapp: { orderUpdates: false, promotions: false, support: false },
  },
  appearance: { theme: 'system', fontSize: 'md', animationLevel: 'full', reduceMotion: false },
  accessibility: {},
  shopping: { saveCards: false, autoApplyCoupons: true, favoriteCategories: [], favoriteBrands: [] },
  fitness: {},
  ai: { aiCoachEnabled: false, aiRecommendations: true, aiMemory: false },
};

@Injectable()
export class PreferencesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureRow(userId: string) {
    return this.prisma.userPreferences.upsert({
      where: { userId },
      create: { userId, ...DEFAULTS },
      update: {},
    });
  }

  async findAll(userId: string) {
    const row = await this.ensureRow(userId);
    return {
      privacy: { ...DEFAULTS.privacy, ...(row.privacy as object) },
      notifications: deepMerge(DEFAULTS.notifications, row.notifications as object),
      appearance: { ...DEFAULTS.appearance, ...(row.appearance as object) },
      accessibility: { ...DEFAULTS.accessibility, ...(row.accessibility as object) },
      shopping: { ...DEFAULTS.shopping, ...(row.shopping as object) },
      fitness: { ...DEFAULTS.fitness, ...(row.fitness as object) },
      ai: { ...DEFAULTS.ai, ...(row.ai as object) },
    };
  }

  async updateSection(userId: string, section: PrefSection, patch: object) {
    await this.ensureRow(userId);
    const row = await this.prisma.userPreferences.findUniqueOrThrow({ where: { userId } });
    const current = (row[section] as object) ?? {};
    const merged = section === 'notifications' ? deepMerge(current, patch) : { ...current, ...patch };

    return this.prisma.userPreferences.update({
      where: { userId },
      data: { [section]: merged },
    });
  }
}

function deepMerge(base: any, patch: any) {
  if (!patch || typeof patch !== 'object') return base;
  const result: any = { ...base };
  for (const key of Object.keys(patch)) {
    if (patch[key] && typeof patch[key] === 'object' && !Array.isArray(patch[key])) {
      result[key] = deepMerge(base?.[key] ?? {}, patch[key]);
    } else if (patch[key] !== undefined) {
      result[key] = patch[key];
    }
  }
  return result;
}

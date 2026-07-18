import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

/**
 * Thin wrapper around Razorpay's order API.
 * Docs: https://razorpay.com/docs/api/orders/
 */
@Injectable()
export class RazorpayService {
  private readonly keyId = process.env.RAZORPAY_KEY_ID;
  private readonly keySecret = process.env.RAZORPAY_KEY_SECRET;

  /** False when Razorpay keys aren't set — lets checkout fall back to pay-on-delivery in dev. */
  get isConfigured(): boolean {
    return Boolean(this.keyId && this.keySecret);
  }

  async createOrder(amountInPaise: number, receipt: string) {
    // Lazy import so the app doesn't crash at boot if the package/env isn't set up yet.
    const Razorpay = (await import('razorpay')).default;
    const instance = new Razorpay({ key_id: this.keyId, key_secret: this.keySecret });

    return instance.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
    });
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const expected = createHmac('sha256', this.keySecret ?? '')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    return expected === signature;
  }
}

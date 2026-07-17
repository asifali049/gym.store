import { Injectable } from '@nestjs/common';

/**
 * Thin wrapper around Razorpay's order API.
 * Requires the `razorpay` npm package (add to apps/api/package.json dependencies).
 * Docs: https://razorpay.com/docs/api/orders/
 */
@Injectable()
export class RazorpayService {
  private readonly keyId = process.env.RAZORPAY_KEY_ID;
  private readonly keySecret = process.env.RAZORPAY_KEY_SECRET;

  async createOrder(amountInPaise: number, receipt: string) {
    // Lazy import so the app doesn't crash in dev if the package/env isn't set up yet
    const Razorpay = (await import('razorpay')).default;
    const instance = new Razorpay({ key_id: this.keyId, key_secret: this.keySecret });

    return instance.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
    });
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const crypto = require('crypto');
    const expected = crypto
      .createHmac('sha256', this.keySecret ?? '')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    return expected === signature;
  }
}

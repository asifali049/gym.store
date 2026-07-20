import { Injectable, Logger } from '@nestjs/common';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger('EmailService');
  private readonly apiKey = process.env.RESEND_API_KEY;
  private readonly fromAddress = process.env.EMAIL_FROM ?? 'PeakFuel <no-reply@peakfuel.com>';

  async send(params: SendEmailParams): Promise<void> {
    if (!this.apiKey) {
      // No email provider configured — log instead of sending, so local/dev
      // environments and the free tier still work without crashing.
      this.logger.warn(`RESEND_API_KEY not set — logging email instead of sending.`);
      this.logger.log(`To: ${params.to} | Subject: ${params.subject}\n${params.html}`);
      return;
    }

    const { Resend } = await import('resend');
    const resend = new Resend(this.apiKey);
    const { error } = await resend.emails.send({
      from: this.fromAddress,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      this.logger.error(`Failed to send email to ${params.to}: ${error.message}`);
    }
  }

  sendWelcomeEmail(to: string, firstName: string) {
    return this.send({
      to,
      subject: 'Welcome to PeakFuel',
      html: `<p>Hi ${firstName},</p><p>Welcome to PeakFuel! Your account is ready — start exploring premium supplements built for real results.</p>`,
    });
  }

  sendPasswordResetEmail(to: string, resetUrl: string) {
    return this.send({
      to,
      subject: 'Reset your PeakFuel password',
      html: `<p>We received a request to reset your password.</p><p><a href="${resetUrl}">Click here to reset your password</a>. This link expires in 1 hour.</p><p>If you didn't request this, you can safely ignore this email.</p>`,
    });
  }

  sendVerificationEmail(to: string, verifyUrl: string) {
    return this.send({
      to,
      subject: 'Verify your PeakFuel email',
      html: `<p>Thanks for signing up! Please confirm your email address.</p><p><a href="${verifyUrl}">Click here to verify your email</a>.</p>`,
    });
  }

  sendOrderConfirmationEmail(to: string, orderId: string, totalAmount: number) {
    return this.send({
      to,
      subject: `Order Confirmed — #${orderId.slice(0, 8)}`,
      html: `<p>Thanks for your order!</p><p>Order <strong>#${orderId.slice(0, 8)}</strong> for <strong>₹${totalAmount.toLocaleString('en-IN')}</strong> has been confirmed and is being processed.</p>`,
    });
  }
}

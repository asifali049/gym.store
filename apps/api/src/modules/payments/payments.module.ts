import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { RazorpayService } from '../../common/payments/razorpay.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, RazorpayService],
})
export class PaymentsModule {}

import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CouponsModule } from '../coupons/coupons.module';
import { RazorpayService } from '../../common/payments/razorpay.service';

@Module({
  imports: [CouponsModule],
  controllers: [OrdersController],
  providers: [OrdersService, RazorpayService],
})
export class OrdersModule {}

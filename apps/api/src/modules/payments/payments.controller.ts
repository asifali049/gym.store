import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('orders/:orderId/create')
  createPaymentOrder(@CurrentUser() user: { userId: string }, @Param('orderId') orderId: string) {
    return this.paymentsService.createPaymentOrder(user.userId, orderId);
  }

  @Post('verify')
  verifyPayment(@CurrentUser() user: { userId: string }, @Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(user.userId, dto);
  }
}

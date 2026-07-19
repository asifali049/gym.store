import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@CurrentUser() user: { userId: string }, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(user.userId, dto);
  }

  @Get()
  findMine(@CurrentUser() user: { userId: string }) {
    return this.ordersService.findMine(user.userId);
  }

  // Declared before ':id' so it isn't swallowed by the single-segment param route.
  @Get('admin/all')
  @Roles('ADMIN', 'SUPER_ADMIN')
  findAllForAdmin(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.findAllForAdmin({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      status,
    });
  }

  @Get(':id')
  findOne(@CurrentUser() user: { userId: string; role: string }, @Param('id') id: string) {
    return this.ordersService.findOne(user.userId, id, user.role);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'SUPER_ADMIN')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}

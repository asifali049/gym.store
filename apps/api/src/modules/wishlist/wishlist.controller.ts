import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { WishlistService } from './wishlist.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

class AddWishlistDto {
  @IsString()
  productId: string;
}

@ApiTags('wishlist')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  findMine(@CurrentUser() user: { userId: string }) {
    return this.wishlistService.findMine(user.userId);
  }

  @Post()
  add(@CurrentUser() user: { userId: string }, @Body() dto: AddWishlistDto) {
    return this.wishlistService.add(user.userId, dto.productId);
  }

  @Delete(':id')
  remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.wishlistService.remove(user.userId, id);
  }
}

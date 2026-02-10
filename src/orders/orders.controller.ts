import { Controller, UseGuards, Body, Post, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { RequestUser } from 'src/auth/types/request-user';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @User('userId') userId: string,
  ) {
    return this.ordersService.createOrder(createOrderDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrdersByUserId(@User('userId') userId: string) {
    return this.ordersService.getOrdersByUserId(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }
}

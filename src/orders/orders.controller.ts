import { Controller, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Body, Post, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
        return this.ordersService.createOrder(createOrderDto, req.user.userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getOrdersByUserId(@Req() req: any) {
        return this.ordersService.getOrdersByUserId(req.user.userId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    getOrderById(@Param('id') id: string) {
        return this.ordersService.getOrderById(id);
    }
}

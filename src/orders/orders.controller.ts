import { Controller, UseGuards, Body, Post, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a new order',
    description:
      'Creates a new shipping order with one or more packages. The order is automatically linked to the authenticated user. The initial status is `PENDING`.',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully — returns the full order object with its packages',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error — missing or invalid fields',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized — missing or invalid JWT token',
  })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @User('userId') userId: string,
  ) {
    return this.ordersService.createOrder(createOrderDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all orders for the authenticated user',
    description:
      'Returns all orders belonging to the currently authenticated user, ordered by creation date (newest first). Each order includes its associated packages.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of orders returned successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized — missing or invalid JWT token',
  })
  async getOrdersByUserId(@User('userId') userId: string) {
    return this.ordersService.getOrdersByUserId(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get a single order by ID',
    description:
      'Returns a specific order by its ID. The authenticated user must be the owner of the order, otherwise a `403 Forbidden` error is returned.',
  })
  @ApiParam({
    name: 'id',
    description: 'The MongoDB ObjectId of the order',
    example: '6830a1b2c3d4e5f678901234',
  })
  @ApiResponse({
    status: 200,
    description: 'Order returned successfully with its packages',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized — missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — the order belongs to another user',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  getOrderById(@Param('id') id: string, @User('userId') userId: string) {
    return this.ordersService.getOrderById(id, userId);
  }
}

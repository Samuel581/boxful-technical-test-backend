import { Controller, UseGuards, Body, Post, Get, Param, Query } from '@nestjs/common';
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
import { GetOrdersQueryDTO } from './dto/get-orders-query.dto';

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
    description:
      'Order created successfully — returns the full order object with its packages',
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
    description: `Returns a **paginated** list of orders belonging to the authenticated user, sorted by creation date (newest first). Each order includes its associated packages.

Supports optional **date filtering** via \`startDate\` and \`endDate\` query params.

**Example usage:**
- \`GET /orders\` — first page, 10 orders, no date filter
- \`GET /orders?page=2&limit=5\` — second page, 5 per page
- \`GET /orders?startDate=2025-01-01&endDate=2025-06-30\` — orders from the first half of 2025
- \`GET /orders?page=1&limit=20&startDate=2025-03-01\` — all combined`,
  })
  @ApiResponse({
    status: 200,
    description:
      'Paginated list of orders with metadata (`data`, `meta: { total, page, limit, totalPages }`)',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error — invalid query params (e.g. page=0, non-numeric limit)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized — missing or invalid JWT token',
  })
  async getOrdersByUserId(@User('userId') userId: string, @Query() query: GetOrdersQueryDTO) {
    return this.ordersService.getOrdersByUserId(userId, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get a single order by ID',
    description:
      'Returns a specific order by its ID. The authenticated user must be the owner of the order, otherwise a `404 Not Found` is returned to avoid leaking order existence.',
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
    status: 400,
    description: 'Bad Request — malformed ObjectId format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized — missing or invalid JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found or belongs to another user',
  })
  getOrderById(@Param('id') id: string, @User('userId') userId: string) {
    return this.ordersService.getOrderById(id, userId);
  }
}

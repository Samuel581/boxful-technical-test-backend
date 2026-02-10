import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from '../generated/prisma/client';
import { Order } from '../generated/prisma/client';
import { GetOrdersQueryDTO } from './dto/get-orders-query.dto';
import { PaginatedOrders } from './types/paginated-orders.type';
@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: string,
  ): Promise<Order | null> {
    const { packages, ...orderData } = createOrderDto;
    const order = await this.ordersRepository.createOrder({
      ...orderData,
      programedDate: new Date(orderData.programedDate),
      user: { connect: { id: userId } },
      packages: { create: packages },
    } as Prisma.OrderCreateInput);
    return order;
  }

  async getOrdersByUserId(userId: string, query: GetOrdersQueryDTO): Promise<PaginatedOrders> {
    const { page, limit, startDate, endDate } = query;
    const skip = (page - 1) * limit;
    
    const [data, total] = await this.ordersRepository.getOrdersByUserId({
      userId,
      skip,
      take: limit,
      startDate,
      endDate,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(id: string, userId: string): Promise<Order | null> {
    const order = await this.ordersRepository.getOrderById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}

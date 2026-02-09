import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from '../generated/prisma/client';
import { Order } from '../generated/prisma/client';
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

  async getOrdersByUserId(userId: string): Promise<Order[] | null> {
    const orders = await this.ordersRepository.getOrdersByUserId(userId);
    if (!orders) {
      throw new NotFoundException('User does not has orders yet');
    }
    return orders;
  }

  async getOrderById(id: string): Promise<Order | null> {
    const order = this.ordersRepository.getOrderById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}

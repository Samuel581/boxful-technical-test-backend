import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  createOrder(data: Prisma.OrderCreateInput) {
    return this.prisma.order.create({ data});
  }

  getOrdersByUserId(userId: string) {
    return this.prisma.order.findMany({ where: { userId }, include: { packages: true } });
  }

  getOrderById(id: string) {
    return this.prisma.order.findUnique({ where: { id }, include: { packages: true } });
  }
  
  updateOrder(id: string, data: Prisma.OrderUpdateInput) {
    return this.prisma.order.update({ where: { id }, data });
  }
}
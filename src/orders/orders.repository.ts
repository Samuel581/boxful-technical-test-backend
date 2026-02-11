import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { GetOrdersQueryDTO } from './dto/get-orders-query.dto';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  createOrder(data: Prisma.OrderCreateInput) {
    return this.prisma.order.create({ data });
  }

  getOrdersByUserId(params: {
    userId: string;
    skip: number;
    take: number;
    startDate?: string;
    endDate?: string;
  }) {

    const { userId, skip, take, startDate, endDate } = params;

    const where: Prisma.OrderWhereInput = {
      userId,
      ...(startDate || endDate
        ? {
            programedDate: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    };

    return this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: { packages: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.order.count({ where }),
    ]);
  }

  getOrderById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { packages: true },
    });
  }

  updateOrder(id: string, data: Prisma.OrderUpdateInput) {
    return this.prisma.order.update({ where: { id }, data });
  }
}

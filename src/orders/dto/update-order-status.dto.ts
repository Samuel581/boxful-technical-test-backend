import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'The new status to set for the order',
    enum: OrderStatus,
    example: OrderStatus.IN_TRANSIT,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

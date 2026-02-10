import { Order } from '../../generated/prisma/client';

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedOrders = {
  data: Order[];
  meta: PaginationMeta;
};

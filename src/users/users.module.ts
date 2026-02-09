import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [UsersService, UserRepository, PrismaService],
  controllers: [],
  exports: [UsersService],
})
export class UsersModule {}

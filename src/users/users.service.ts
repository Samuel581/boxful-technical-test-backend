import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../generated/prisma/client.js';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserDto): Promise<User | null> {
    const userExists = (await this.userRepository.getByEmail(data.email))
      ? true
      : false;

    if (userExists) throw new ConflictException('Email already in registered');

    return this.userRepository.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.getByEmail(email);
  }
}

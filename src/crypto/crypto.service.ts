import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptoService {
  private readonly saltRounds: number;

  constructor(private readonly config: ConfigService) {
    this.saltRounds = Number(this.config.get('SALT_ROUNDS')) || 10;
  }

  async hashPasword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { CryptoService } from '../crypto/crypto.service.js';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto.js';
import { AuthJwtPayload } from './types/auth-jwt.payload.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserData: RegisterDto) {
    const hashedPassword = await this.cryptoService.hashPasword(
      registerUserData.password,
    );

    const user = await this.usersService.createUser({
      ...registerUserData,
      password: hashedPassword,
    });

    return { user };
  }

  async login(loginData: LoginDto) {
    const user = await this.usersService.findByEmail(loginData.email);
    if (!user)
      throw new BadRequestException(
        `User with email ${loginData.email} not found`,
      );

    const passwordMatches = await this.cryptoService.comparePassword(
      loginData.password,
      user.password,
    );
    if (!passwordMatches) throw new UnauthorizedException('Invalid password');

    const payload: AuthJwtPayload = {
      sub: user.id,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }
}

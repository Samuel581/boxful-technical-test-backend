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

    await this.usersService.createUser({
      ...registerUserData,
      password: hashedPassword,
    });

    return;
  }

  async login(loginData: LoginDto) {
    const user = await this.usersService.findByEmail(loginData.email);
    if (!user) throw new BadRequestException(`Invalid credentials`);

    const passwordMatches = await this.cryptoService.comparePassword(
      loginData.password,
      user.password,
    );
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    const payload: AuthJwtPayload = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}

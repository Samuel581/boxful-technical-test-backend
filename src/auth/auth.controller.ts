import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account. The email and phone must be unique across the system. The password is hashed before storage.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error — missing or invalid fields',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict — email or phone already registered',
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Log in and obtain a JWT token',
    description:
      'Authenticates a user with email and password. Returns a JWT access token valid for 1 hour. Use the token in the `Authorization: Bearer <token>` header for protected endpoints.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful — JWT token returned',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials — email not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials — wrong password',
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}

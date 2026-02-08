import { JwtModuleOptions } from '@nestjs/jwt';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET || 'fallback-secret-key', // Ensure JWT_SECRET is set in .env
    signOptions: { expiresIn: '1h' },
  }),
);

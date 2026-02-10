import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The registered email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The user password (minimum 8 characters)',
    example: 'MySecureP@ss1',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}

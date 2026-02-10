import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export enum Sex {
  M = 'M',
  F = 'F',
  OTHER = 'OTHER',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'First name(s) of the user',
    example: 'John Carlos',
  })
  @IsString()
  @IsNotEmpty()
  firstnames: string;

  @ApiProperty({
    description: 'Last name(s) of the user',
    example: 'Doe Smith',
  })
  @IsString()
  @IsNotEmpty()
  lastnames: string;

  @ApiProperty({
    description: 'Biological sex of the user',
    enum: Sex,
    example: Sex.M,
  })
  @IsEnum(Sex)
  sex: Sex;

  @ApiProperty({
    description:
      'Date of birth in full ISO-8601 DateTime format. **Must include the time component** (e.g. `T00:00:00.000Z`), otherwise the server will reject it.',
    example: '1995-06-15T00:00:00.000Z',
  })
  @IsDateString()
  borndate: string;

  @ApiProperty({
    description: 'Email address (must be unique across the system)',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Phone number with optional country code. Must be 7-15 digits, optionally prefixed with +',
    example: '+50312345678',
    pattern: '^\\+?[0-9]{7,15}$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[0-9]{7,15}$/)
  phone: string;

  @ApiProperty({
    description: 'Account password (minimum 8 characters)',
    example: 'MySecureP@ss1',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}

import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

enum Sex {
  M = 'M',
  F = 'F',
  OTHER = 'OTHER',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstnames: string;

  @IsString()
  @IsNotEmpty()
  lastnames: string;

  @IsEnum(Sex)
  sex: Sex;

  @IsDateString()
  borndate: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;
}

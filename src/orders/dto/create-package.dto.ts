import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePackageDto {
  @ApiProperty({
    description: 'Weight of the package in pounds (must be positive)',
    example: 5.5,
    minimum: 0,
    exclusiveMinimum: true,
  })
  @IsNumber()
  @IsPositive()
  weight: number;

  @ApiProperty({
    description: 'Description of the package contents',
    example: 'Electronics - Laptop and charger',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Height of the package in centimeters (must be positive)',
    example: 30,
    minimum: 0,
    exclusiveMinimum: true,
  })
  @IsNumber()
  @IsPositive()
  height: number;

  @ApiProperty({
    description: 'Length of the package in centimeters (must be positive)',
    example: 40,
    minimum: 0,
    exclusiveMinimum: true,
  })
  @IsNumber()
  @IsPositive()
  length: number;

  @ApiProperty({
    description: 'Width of the package in centimeters (must be positive)',
    example: 25,
    minimum: 0,
    exclusiveMinimum: true,
  })
  @IsNumber()
  @IsPositive()
  width: number;
}

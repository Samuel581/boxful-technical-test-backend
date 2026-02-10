import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsOptional,
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreatePackageDto } from './create-package.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Full address where the packages will be picked up',
    example: 'Colonia Escalón, Calle El Mirador #123, San Salvador',
  })
  @IsString()
  @IsNotEmpty()
  recolectionAddress: string;

  @ApiProperty({
    description:
      'Scheduled date for the pickup in ISO-8601 format. Accepts both `2025-07-20` and `2025-07-20T10:00:00.000Z`.',
    example: '2025-07-20T10:00:00.000Z',
  })
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  programedDate: string;

  @ApiProperty({
    description: 'First name(s) of the recipient',
    example: 'María José',
  })
  @IsString()
  @IsNotEmpty()
  recipientNames: string;

  @ApiProperty({
    description: 'Last name(s) of the recipient',
    example: 'López García',
  })
  @IsString()
  @IsNotEmpty()
  recipientLastNames: string;

  @ApiProperty({
    description: 'Email address of the recipient for delivery notifications',
    example: 'maria.lopez@example.com',
  })
  @IsEmail()
  recipientEmail: string;

  @ApiProperty({
    description: 'Phone number of the recipient',
    example: '+50376543210',
  })
  @IsString()
  @IsNotEmpty()
  recipientCellphone: string;

  @ApiProperty({
    description: 'Full delivery address for the order',
    example: 'Residencial Las Magnolias, Casa #45, Santa Tecla',
  })
  @IsString()
  @IsNotEmpty()
  destinationAddress: string;

  @ApiProperty({
    description: 'State/department of the delivery address',
    example: 'San Salvador',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'City of the delivery address',
    example: 'Santa Tecla',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({
    description:
      'A nearby landmark or reference point to help locate the delivery address',
    example: 'Across from the green pharmacy',
  })
  @IsString()
  @IsOptional()
  referencePoint: string;

  @ApiPropertyOptional({
    description: 'Any special instructions for the delivery driver',
    example: 'Ring the bell twice. Fragile contents — handle with care.',
  })
  @IsString()
  @IsOptional()
  additionalInstructions?: string;

  @ApiProperty({
    description: 'List of packages included in this order (at least 1)',
    type: [CreatePackageDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePackageDto)
  packages: CreatePackageDto[];
}

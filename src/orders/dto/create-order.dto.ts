import { Type } from 'class-transformer';
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
  @IsString()
  @IsNotEmpty()
  recolectionAddress: string;

  @IsDateString()
  programedDate: string;

  @IsString()
  @IsNotEmpty()
  recipientNames: string;

  @IsString()
  @IsNotEmpty()
  recipientLastNames: string;

  @IsEmail()
  recipientEmail: string;

  @IsString()
  @IsNotEmpty()
  recipientCellphone: string;

  @IsString()
  @IsNotEmpty()
  destinationAddress: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  referencePoint: string;

  @IsString()
  @IsOptional()
  additionalInstructions?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePackageDto)
  packages: CreatePackageDto[];
}

import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePackageDto {
  @IsNumber()
  @IsPositive()
  weight: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsPositive()
  height: number;

  @IsNumber()
  @IsPositive()
  length: number;

  @IsNumber()
  @IsPositive()
  width: number;
}

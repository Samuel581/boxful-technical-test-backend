import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class GetOrdersQueryDTO {
  @ApiPropertyOptional({
    description: 'Page number (starts at 1)',
    default: 1,
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of orders per page',
    default: 10,
    example: 10,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  limit: number = 10;

  @ApiPropertyOptional({
    description:
      'Filter orders created on or after this date (ISO-8601 format). Accepts both `2025-01-01` and `2025-01-01T00:00:00.000Z`.',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  startDate: string;

  @ApiPropertyOptional({
    description:
      'Filter orders created on or before this date (ISO-8601 format). Accepts both `2025-12-31` and `2025-12-31T23:59:59.999Z`.',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  endDate: string;
}
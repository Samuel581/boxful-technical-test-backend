import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      // Unique constraint violation
      case 'P2002': {
        const target = (exception.meta?.target as string[])?.join(', ');
        return response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: `A record with that ${target || 'value'} already exists`,
        });
      }

      // Record not found
      case 'P2025': {
        return response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message:
            (exception.meta?.cause as string) ||
            'The requested record was not found',
        });
      }

      // Malformed ObjectID or invalid argument
      case 'P2023': {
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message:
            (exception.meta?.message as string) || 'Invalid ID format provided',
        });
      }

      // Foreign key constraint violation
      case 'P2003': {
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: `Related record not found for field: ${exception.meta?.field_name || 'unknown'}`,
        });
      }

      // Fallback for any other Prisma error
      default: {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
          message: 'An unexpected database error occurred',
        });
      }
    }
  }
}

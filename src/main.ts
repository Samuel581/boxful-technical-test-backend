import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Boxful Orders API')
    .setDescription(
      `## Overview
This is the REST API for the **Boxful Orders Management System**. It allows users to register, authenticate, and manage shipping orders with associated packages.

## Authentication
All \`/orders\` endpoints require a valid **JWT Bearer token**. To obtain a token:
1. Register a new account via \`POST /auth/register\`
2. Log in via \`POST /auth/login\` to receive your access token
3. Include the token in the \`Authorization\` header: \`Bearer <your_token>\`

The token expires after **1 hour**.

## Key Concepts
- **User**: A registered account that can create and manage orders.
- **Order**: A shipping request containing sender/recipient info, addresses, and one or more packages.
- **Package**: A physical parcel with weight and dimensions, always associated with an order.

## Validation
All request bodies are validated automatically. Requests with invalid or missing fields will return a \`400 Bad Request\` with details about the validation errors.

## Ownership
Users can only access their own orders. Attempting to access another user's order will return \`403 Forbidden\`.`,
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description:
        'Enter the JWT token obtained from the POST /auth/login endpoint',
    })
    .addTag(
      'Health',
      'Health check endpoint to verify the API is running',
    )
    .addTag(
      'Auth',
      'Authentication endpoints for user registration and login. These are public and do not require a token.',
    )
    .addTag(
      'Orders',
      'Order management endpoints. All endpoints require JWT authentication. Users can only access their own orders.',
    )
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup('docs', app, documentFactory)


  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://boxful-technical-test-frontend.vercel.app/',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

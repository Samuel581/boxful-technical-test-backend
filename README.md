# Boxful Orders API

REST API for a shipping orders management system built with NestJS, Prisma, and MongoDB.

**Live Demo:** [https://boxful-technical-test-backend.onrender.com/](https://boxful-technical-test-backend.onrender.com/)

## Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Runtime        | Node.js 20+                         |
| Framework      | NestJS 11                           |
| Language       | TypeScript 5                        |
| Database       | MongoDB (Atlas)                     |
| ORM            | Prisma 6                            |
| Authentication | JWT (Passport)                      |
| Validation     | class-validator + class-transformer |
| Documentation  | Swagger / OpenAPI 3                 |
| Package Manager    | pnpm                               |

## Getting Started

### Option A — Docker (recommended)

The only prerequisites are **Docker** and **Docker Compose**.

```bash
# Clone the repository
git clone https://github.com/Samuel581/boxful-technical-test-backend.git
cd boxful-technical-test-backend

# Create the shared Docker network (one-time, shared with the frontend)
docker network create boxful-network

# Build and start the API + MongoDB
docker compose up --build -d

# Seed the database with sample data (one-time)
docker compose --profile seed run --rm seed
```

Both Node.js and MongoDB run inside containers — nothing else to install.

Both the backend and the [frontend](https://github.com/Samuel581/boxful-technical-test-frontend) share the `boxful-network` Docker network so they can communicate when running side by side. The frontend will be available at `http://localhost:8080` and the backend at `http://localhost:3000`.

| Command | Description |
| --- | --- |
| `docker network create boxful-network` | Create the shared network (one-time) |
| `docker compose up --build -d` | Build images and start the stack in the background |
| `docker compose --profile seed run --rm seed` | Seed the database (runs once and exits) |
| `docker compose logs -f api` | Follow API logs |
| `docker compose down` | Stop all containers |
| `docker compose down -v` | Stop all containers and wipe the database volume |

To connect **MongoDB Compass** to the containerized database:

```
mongodb://localhost:27017/boxful?replicaSet=rs0&directConnection=true
```

### Option B — Local

#### Prerequisites

- Node.js >= 20
- pnpm >= 9
- A MongoDB instance (local or Atlas)

#### Installation

```bash
# Clone the repository
git clone https://github.com/Samuel581/boxful-technical-test-backend.git
cd boxful-technical-test-backend

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

Edit the `.env` file with your values (Docker injects these automatically):

```env
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=your_secret_key_here
SALT_ROUNDS=10
PORT=3000
```

| Variable       | Description                                | Required |
| -------------- | ------------------------------------------ | -------- |
| `DATABASE_URL` | MongoDB connection string                  | Yes      |
| `JWT_SECRET`   | Secret key for signing JWT tokens          | Yes      |
| `SALT_ROUNDS`  | bcrypt hashing rounds (default: 10)        | No       |
| `PORT`         | Port the server listens on (default: 3000) | No       |

### Database Setup (local only)

```bash
# Generate the Prisma client
npx prisma generate

# Push the schema to the database (creates collections and indexes)
npx prisma db push

# Seed the database with sample data
npx prisma db seed
```

The seed creates **5 users**, **24 orders**, and **35 packages** with realistic data. All seed users share the password `Password123`.

| Test Account                | Orders | Statuses covered                          |
| --------------------------- | ------ | ----------------------------------------- |
| carlos.martinez@example.com | 6      | DELIVERED, IN_TRANSIT, PENDING, CANCELLED |
| maria.garcia@example.com    | 5      | DELIVERED, IN_TRANSIT, PENDING            |
| alex.rivera@example.com     | 4      | DELIVERED, IN_TRANSIT, PENDING            |
| sofia.flores@example.com    | 4      | DELIVERED, CANCELLED, PENDING             |
| diego.ramos@example.com     | 5      | DELIVERED, IN_TRANSIT, PENDING            |

### Running the App

```bash
# Development (hot reload)
pnpm start:dev

# Production build
pnpm build
pnpm start:prod
```

The server starts on `http://localhost:3000` (or the `PORT` you configured).

## API Documentation

Interactive Swagger docs are available at:

- **Local:** `http://localhost:3000/docs`
- **Production:** `https://boxful-technical-test-backend.onrender.com/docs`

### Endpoints Overview

#### Health

| Method | Endpoint | Description  | Auth |
| ------ | -------- | ------------ | ---- |
| GET    | `/`      | Health check | No   |

#### Auth

| Method | Endpoint         | Description                    | Auth |
| ------ | ---------------- | ------------------------------ | ---- |
| POST   | `/auth/register` | Register a new user            | No   |
| POST   | `/auth/login`    | Log in and receive a JWT token | No   |

#### Orders

| Method | Endpoint      | Description                         | Auth |
| ------ | ------------- | ----------------------------------- | ---- |
| POST   | `/orders`     | Create a new order with packages    | JWT  |
| GET    | `/orders`     | List orders (paginated, filterable) | JWT  |
| GET    | `/orders/:id` | Get a single order by ID            | JWT  |

### Authentication Flow

1. **Register** a new account:
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "firstnames": "John",
       "lastnames": "Doe",
       "sex": "M",
       "borndate": "1995-06-15",
       "email": "john@example.com",
       "phone": "+50312345678",
       "password": "MySecureP@ss1"
     }'
   ```

2. **Log in** to get a token:
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "john@example.com",
       "password": "MySecureP@ss1"
     }'
   ```
   Response:
   ```json
   { "accessToken": "eyJhbGciOiJIUzI1NiIs..." }
   ```

3. **Use the token** on protected endpoints:
   ```bash
   curl http://localhost:3000/orders \
     -H "Authorization: Bearer <your_token>"
   ```

### Pagination & Filtering

`GET /orders` supports query parameters:

| Param       | Type   | Default | Description                         |
| ----------- | ------ | ------- | ----------------------------------- |
| `page`      | number | 1       | Page number (starts at 1)           |
| `limit`     | number | 10      | Items per page                      |
| `startDate` | string | --      | Filter orders from this date (ISO)  |
| `endDate`   | string | --      | Filter orders until this date (ISO) |

**Examples:**

```bash
# Page 2, 5 per page
GET /orders?page=2&limit=5

# Orders from the first half of 2025
GET /orders?startDate=2025-01-01&endDate=2025-06-30

# Combined
GET /orders?page=1&limit=20&startDate=2025-03-01
```

**Response shape:**

```json
{
  "data": [ ... ],
  "meta": {
    "total": 24,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

## Project Structure

```
src/
├── main.ts                           # Bootstrap, Swagger, global pipes & filters
├── app.module.ts                     # Root module
├── app.controller.ts                 # Health check endpoint
├── auth/
│   ├── auth.controller.ts            # Register & login endpoints
│   ├── auth.service.ts               # Auth business logic
│   ├── config/jwt.config.ts          # JWT configuration
│   ├── decorators/user.decorator.ts  # @User() param decorator
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── guard/jwt-auth.guard.ts       # JWT route guard
│   ├── strategies/jwt.strategy.ts    # Passport JWT strategy
│   └── types/
│       ├── auth-jwt.payload.ts
│       └── request-user.ts
├── orders/
│   ├── orders.controller.ts          # CRUD endpoints
│   ├── orders.service.ts             # Business logic & pagination
│   ├── orders.repository.ts          # Prisma queries
│   ├── dto/
│   │   ├── create-order.dto.ts
│   │   ├── create-package.dto.ts
│   │   ├── get-orders-query.dto.ts
│   │   └── update-order-status.dto.ts
│   └── types/
│       └── paginated-orders.type.ts
├── users/
│   ├── users.service.ts              # User business logic
│   ├── users.repository.ts           # Prisma queries
│   └── dto/create-user.dto.ts
├── crypto/
│   └── crypto.service.ts             # Password hashing (bcrypt)
├── prisma/
│   ├── prisma.module.ts              # Global Prisma module
│   ├── prisma.service.ts             # Prisma client wrapper
│   └── prisma-exception.filter.ts    # Global Prisma error handler
└── generated/prisma/                 # Auto-generated Prisma client
```

## Architecture Decisions

### Layered Architecture

Each module follows a **Controller > Service > Repository** pattern:

- **Controller** -- Handles HTTP concerns (routes, guards, validation, Swagger docs). No business logic.
- **Service** -- Business logic, authorization checks, data shaping. No Prisma imports.
- **Repository** -- Database queries only. Owns all Prisma-specific code.

This separation means swapping the ORM only requires changing the repository layer.

### Error Handling

- **ValidationPipe** (global) -- Rejects invalid request bodies with detailed 400 errors.
- **PrismaExceptionFilter** (global) -- Catches Prisma errors and maps them to proper HTTP responses:

  | Prisma Code | HTTP Status     | Meaning                |
  | ----------- | --------------- | ---------------------- |
  | P2002       | 409 Conflict    | Duplicate unique field |
  | P2023       | 400 Bad Request | Malformed ObjectId     |
  | P2025       | 404 Not Found   | Record not found       |
  | P2003       | 400 Bad Request | Foreign key violation  |

- **NestJS Exceptions** -- Used in services for business-rule violations (`NotFoundException`, `ConflictException`, `UnauthorizedException`).

### Security

- Passwords are hashed with **bcrypt** before storage (configurable salt rounds).
- JWT tokens expire after **1 hour**.
- **Ownership enforcement** -- Users can only access their own orders. Requesting another user's order returns 404 (not 403) to avoid leaking order existence.
- **Validation whitelisting** -- `forbidNonWhitelisted: true` strips and rejects unknown fields.
- Date inputs are **auto-transformed** to full ISO-8601 via `@Transform`, so both `1995-06-15` and `1995-06-15T00:00:00.000Z` are accepted.

### Database

MongoDB via Prisma ORM with the following indexes:

- `Order.userId` -- Fast lookup for user's orders
- `Order.createdAt (desc)` -- Supports sorted pagination
- `Package.orderId` -- Fast join from order to packages
- `User.email` / `User.phone` -- Unique constraints

## Available Scripts

| Script              | Description                            |
| ------------------- | -------------------------------------- |
| `pnpm start:dev`    | Start in development mode (hot reload) |
| `pnpm start:prod`   | Start production build                 |
| `pnpm build`        | Compile TypeScript to `dist/`          |
| `pnpm lint`         | Run ESLint with auto-fix               |
| `pnpm format`       | Format code with Prettier              |
| `npx prisma db seed`  | Seed the database with sample data   |
| `npx prisma studio`   | Open Prisma Studio (visual DB browser) |

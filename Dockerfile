
FROM node:20-alpine AS deps

RUN corepack enable pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile


FROM node:20-alpine AS build

RUN corepack enable pnpm

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma generate does not connect — dummy URL satisfies env() validation
ENV DATABASE_URL="mongodb://placeholder:27017/build"

RUN pnpm prisma generate \
 && pnpm build \
 && cp src/generated/prisma/*.node dist/src/generated/prisma/ 2>/dev/null || true


FROM build AS pruned

RUN pnpm prune --prod


FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init

ENV NODE_ENV=production

WORKDIR /app

COPY --from=pruned /app/dist            ./dist
COPY --from=pruned /app/node_modules    ./node_modules
COPY --from=pruned /app/package.json    ./

USER node

EXPOSE 3000

CMD ["dumb-init", "node", "dist/src/main.js"]

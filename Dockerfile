FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY pnpm-lock.yaml .
COPY package.json .
COPY pnpm-workspace.yaml .


FROM base AS production-deps

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:22-slim

WORKDIR /app

COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["node", "dist/main"]

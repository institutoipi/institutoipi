# syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app ./
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS=--no-deprecation
# Segredos reais NÃO entram na imagem — em runtime vêm do k8s (envFrom do Secret SOPS
# institutoipi-env e DATABASE_URL do secret do CNPG). O build só precisa de um
# PAYLOAD_SECRET não-vazio para instanciar a config; usamos placeholders efêmeros,
# válidos apenas dentro do processo deste RUN (não são gravados em camadas).
RUN --mount=type=cache,target=/app/.next/cache \
    PAYLOAD_SECRET="build-time-placeholder" \
    DATABASE_URL="postgres://build:build@127.0.0.1:5432/build" \
    npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]

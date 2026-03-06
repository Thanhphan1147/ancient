# =============================================================================
# Project Ancient – Multi-stage Docker Build
# Single container: Colyseus server + static Svelte client on port 2567
# =============================================================================

# ── Stage 1: base ────────────────────────────────────────────
# Shared Node image with workspace-level deps installed
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
COPY shared/package.json shared/
COPY client/package.json client/
COPY server/package.json server/
RUN npm ci

# ── Stage 2: build-shared ────────────────────────────────────
FROM base AS build-shared
COPY shared/ shared/
RUN npx tsc --build shared/tsconfig.json

# ── Stage 3: build-client ────────────────────────────────────
FROM build-shared AS build-client
COPY client/ client/
RUN npm run build -w client

# ── Stage 4: build-server ────────────────────────────────────
FROM build-shared AS build-server
COPY server/ server/
RUN npm run build -w server

# ── Stage 5: production runtime ──────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy only workspace manifests and install production deps
COPY package.json package-lock.json ./
COPY shared/package.json shared/
COPY server/package.json server/
RUN npm ci --omit=dev

# Copy compiled shared
COPY --from=build-shared /app/shared/dist/ shared/dist/
COPY --from=build-shared /app/shared/src/ shared/src/

# Copy compiled server
COPY --from=build-server /app/server/dist/ server/dist/

# Copy built client static assets
COPY --from=build-client /app/client/dist/ server/client-dist/

EXPOSE 2567

CMD ["node", "server/dist/index.js"]

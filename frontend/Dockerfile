# ─────────────────────────────────────────
# Stage 1: Build React App
# ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Cache node_modules layer
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source and build
COPY public ./public
COPY src ./src
RUN npm run build

# ─────────────────────────────────────────
# Stage 2: Serve with nginx (minimal image)
# ─────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config for SPA
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

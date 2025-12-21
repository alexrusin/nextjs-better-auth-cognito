# ------------------------------
# Build stage
# ------------------------------
FROM node:24-alpine AS builder

# Build-time arguments
ARG NEXT_PUBLIC_APP_URL
ARG MONGODB_URI
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    MONGODB_URI=$MONGODB_URI \
    NODE_ENV=production

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build Next.js app in standalone mode
RUN npm run build

# ------------------------------
# Production stage
# ------------------------------
FROM node:24-alpine AS runner

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy standalone build from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
 && adduser -S nextjs -u 1001 \
 && chown -R nextjs:nodejs /app
USER nextjs

# Set production environment
ENV NODE_ENV=production

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
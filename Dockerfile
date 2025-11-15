# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Install dumb-init and postgresql-client for proper signal handling and wait-for-db
RUN apk add --no-cache dumb-init postgresql-client

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies (need dev dependencies for sequelize-cli)
RUN yarn install --frozen-lockfile

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/models ./models

# Copy database migrations and configuration
COPY db ./db
COPY src/database/sequelize.config.js ./src/database/
COPY .sequelizerc ./

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose the port
EXPOSE 3000

# Health check - Use node to check if port is listening
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:3000/api/docs', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application using the entrypoint script
CMD ["docker-entrypoint.sh"]

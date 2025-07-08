FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY angular.json tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Production stage - serve the built application
FROM nginx:alpine

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 4200

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 
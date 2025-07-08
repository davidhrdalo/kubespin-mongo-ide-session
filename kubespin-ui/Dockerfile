FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
# Use npm install instead of npm ci to handle potential lock file sync issues
RUN npm install

# Copy source code
COPY . .

# Build the application with Vite
RUN npm run build

# Use nginx to serve the built files
FROM nginx:alpine

# Copy built files from the build stage (Vite outputs to 'dist' by default)
COPY --from=0 /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 
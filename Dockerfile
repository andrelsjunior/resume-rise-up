# Stage 1: Build the application using Bun
FROM oven/bun:1 as builder

WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Copy the .env file for build-time environment variables
# IMPORTANT: Ensure your .env file is present in the build context
# and contains the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
COPY .env .env

# Build the application
RUN bun run build

# Stage 2: Serve the application using Nginx
FROM nginx:1.25-alpine as server

# Set working directory for Nginx
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=builder /app/dist .

# Copy custom Nginx configuration (will be created in the next step)
# This nginx.conf should handle SPA routing (e.g., try_files $uri $uri/ /index.html;)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

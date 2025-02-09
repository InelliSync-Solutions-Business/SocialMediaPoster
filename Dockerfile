# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies and build
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve using Nginx
FROM nginx:alpine

# Copy build output to Nginx directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

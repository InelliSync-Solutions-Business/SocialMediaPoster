# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the entire server directory
COPY . .

# Expose backend port
EXPOSE 3000

# Start the server
CMD ["node", "server.mjs"]

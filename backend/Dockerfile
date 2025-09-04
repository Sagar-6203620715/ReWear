# Backend Dockerfile for Render
FROM node:22-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production || npm install --only=production

# Copy source
COPY . .

# Environment & port
ENV NODE_ENV=production
ENV PORT=10000

# Expose the port
EXPOSE 10000

# Start server (Render will override PORT env if needed)
CMD ["npm", "start"]
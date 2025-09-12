# Base Image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /usr/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript project
RUN npm run build

FROM node:18-alpine

WORKDIR /usr/app

# Copy only the necessary files for production
COPY --from=builder /usr/app/package*.json ./
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/dist ./dist

# This ensures the `prisma/schema.prisma` file is present
COPY prisma ./prisma/

# This is important for Prisma migrations to run
RUN npx prisma generate --data-proxy

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
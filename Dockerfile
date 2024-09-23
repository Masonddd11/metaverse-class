# Use the official Node.js 18 Alpine image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
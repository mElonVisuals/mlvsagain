# Use Node.js 20 Alpine as the base image for the build stage.
# This resolves dependency compatibility issues.
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Install Python, FFmpeg, and other build tools required by some npm packages.
# The --no-cache flag keeps the image size small.
RUN apk add --no-cache python3 make g++ ffmpeg

# Copy package.json and package-lock.json to install dependencies
# We copy them first to leverage Docker's layer caching
COPY package*.json ./

# Install the dependencies. We use 'npm ci' for clean, repeatable builds.
# It requires a package-lock.json file to be present.
RUN npm ci

# Copy the rest of your application code
COPY . .

# The "production" stage
# Use a fresh, clean Node.js 20 Alpine image for the final, production-ready container
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
# This creates a smaller final image without build dependencies
COPY --from=builder /app ./

# The command to run your application when the container starts
# This uses the 'start' script from your package.json
CMD ["npm", "start"]

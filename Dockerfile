# Use Node.js 20 Alpine as the base image for the build stage.
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Install Python3, FFmpeg, and yt-dlp using the Alpine package manager.
# It is CRITICAL to install these in the production stage to ensure they are available.
# We're also installing them here in the builder stage for any build-time dependencies.
RUN apk add --no-cache python3 make g++ ffmpeg yt-dlp

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install the Node.js dependencies using 'npm ci' for a clean build.
RUN npm ci

# Copy the rest of your application code
COPY . .

# --- START OF PRODUCTION IMAGE STAGE ---
# This is the final, smaller image that will actually run your bot.
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# THIS IS THE CRITICAL PART: Re-install FFmpeg and yt-dlp in the final production image.
# This ensures the binaries are present and accessible to your Node.js application.
RUN apk add --no-cache ffmpeg yt-dlp

# Copy only the necessary files from the builder stage
COPY --from=builder /app ./

# The command to run your application when the container starts
CMD ["npm", "start"]

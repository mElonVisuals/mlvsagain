# Use a lightweight Node.js image as the base
# This is the "build" stage
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or pnpm-lock.yaml) to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your bot will run on.
# Discord bots don't always need a port, but if your bot has an API or web server,
# you'll need to specify it here. Replace 3000 with your bot's port if needed.
# For a typical bot, you might not need EXPOSE.
# EXPOSE 3000

# The "production" stage
FROM node:18-alpine

WORKDIR /app

# Copy only the necessary files from the builder stage
# This creates a smaller final image
COPY --from=builder /app ./

# The command to run your application when the container starts
# This uses the 'start' script from your package.json
CMD ["npm", "start"]

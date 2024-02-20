# Use the official Node.js 18.16.0 image based on Alpine Linux
FROM node:18.16.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the port on which the app listens (adjust if necessary)
EXPOSE 8880

# Start the application
CMD ["npm", "run", "build-start"]

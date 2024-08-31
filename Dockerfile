# Use the official Node.js 18.16.0 image based on Alpine Linux
# FROM node:18.16.0-alpine

# Use the latest Node.js image based on Alpine Linux
# FROM node:alpine
FROM node:22.6-alpine


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
CMD ["npm", "run", "start"]

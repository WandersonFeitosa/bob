# Use an official Node.js runtime as a base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the entire application to the container
COPY . .

# Install application dependencies
RUN npm run build

# Expose the port that the application will run on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "run", "start:prod"]

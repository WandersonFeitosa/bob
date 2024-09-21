# Use an official Node.js runtime as a base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Install google cloud sdk
RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates gnupg curl && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    apt-get update && \
    apt-get install -y google-cloud-cli 

# Copy the credentials.json file to the container
COPY credentials/credentials.json ./credentials.json

# Authenticate with Google Cloud
RUN gcloud auth activate-service-account --key-file=./credentials.json

RUN gcloud config set project decent-micron-434613-t6
# Install kubectl
RUN apt-get update && \
    apt-get install -y google-cloud-sdk-gke-gcloud-auth-plugin

# Connect to the cluster
RUN gcloud container clusters get-credentials deadlock-cluster --region southamerica-east1-b

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

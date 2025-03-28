# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Enable Corepack (needed for Yarn 3+)
RUN corepack enable

# Copy package.json and yarn.lock into the container at /usr/src/app
# COPY package.json ./

# Copy the rest of your application's source code from your host to your image filesystem.
COPY . .

# Install any needed packages specified in package.json
RUN yarn install

# Change directory to where the site is located
WORKDIR /usr/src/app/packages/site

# Build the webapp
RUN yarn run build

# Expose the port the app runs on
EXPOSE 9000

# Run the application
CMD ["yarn", "gatsby", "serve", "-H", "0.0.0.0"]
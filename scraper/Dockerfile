FROM mcr.microsoft.com/playwright:v1.41.0-jammy

# Define working directory
WORKDIR /app

# Install project dependencies
COPY package*.json ./

# Use ci for reliable, exact dependency installation
RUN npm ci

# Copy all source files
COPY . .

# Compile TypeScript
RUN npm run build

# Expose the API port
EXPOSE 3001

# Command to run the production build
CMD ["npm", "run", "serve"]

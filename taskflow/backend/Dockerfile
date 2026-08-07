FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (runs prisma generate via postinstall)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npx tsc

# Let Railway inject PORT dynamically
# Start: push DB schema then run server
CMD sh -c "(npx prisma db push --accept-data-loss || echo 'DB push failed, starting server anyway...') && node dist/index.js"

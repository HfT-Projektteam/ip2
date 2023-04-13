# Building layer
FROM node:18.15.0-alpine as development

WORKDIR /app

# Copy configuration files
COPY tsconfig*.json ./
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy application sources (.ts, .tsx, js)
COPY src/ src/

# Build application (produces dist/ folder)
RUN yarn build

# Runtime (production) layer
FROM node:18.15.0-alpine as production

WORKDIR /app

# Copy dependencies files
COPY package.json ./
COPY yarn.lock ./

# Install runtime dependecies (without dev/test dependecies)
RUN yarn install --dev

# Copy production build
COPY --from=development /app/dist/ ./dist/

# Expose application port
EXPOSE 3000

# Start application
CMD [ "node", "dist/main.js" ]

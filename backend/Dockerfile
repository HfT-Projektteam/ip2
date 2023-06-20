# Building layer
FROM node:18.15.0-alpine as deployment

WORKDIR /app

# Copy configuration files
COPY tsconfig*.json ./
COPY package.json ./
COPY yarn.lock ./
COPY src/ src/

# Install dependencies
RUN npm i -g @nestjs/cli
RUN yarn install --devDependencies

RUN yarn build

COPY src/config/.env src/config/.env.prod dist/config/

# Expose application port
EXPOSE 3000

RUN ls -alh ./dist/config

# Start application
CMD [ "node", "dist/main.js" ]

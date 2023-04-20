# Building layer
FROM node:18.15.0-alpine as build

WORKDIR /app

# Copy configuration files
COPY tsconfig*.json  craco*.js ./
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy application sources (.ts, .tsx, js)
COPY src/ src/
COPY public/ public/

# Build application
RUN yarn build

# release step
FROM nginx:1.21.5-alpine as release

COPY --from=build /app/build /usr/share/nginx/html
COPY ./deployment/nginx.conf /etc/nginx/conf.d/default.conf
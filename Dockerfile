# Build environment
FROM node:12-alpine as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
RUN npm run build

# Production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf.template
COPY start.sh ./
RUN chmod +x start.sh
ENTRYPOINT ["/bin/sh", "start.sh"]
#CMD ["nginx", "-g", "daemon off;"]

FROM node:12-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
CMD ["node", "mockend.js"]

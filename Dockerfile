FROM node:14

WORKDIR /app/quick_poll

COPY package*.json ./
RUN npm ci

COPY . .

CMD [ "node", "dist/index.js" ]

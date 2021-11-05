FROM node:16

WORKDIR /app/quick_poll

COPY package*.json ./
RUN [ "npm", "ci", "--production" ]

COPY . .

CMD [ "node", "dist/index.js" ]

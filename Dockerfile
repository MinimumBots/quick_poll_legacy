FROM node:18

WORKDIR /app/quick_poll

COPY package*.json ./
RUN [ "npm", "ci", "--production" ]

COPY . .

CMD [ "npm", "start" ]

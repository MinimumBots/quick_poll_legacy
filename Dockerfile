FROM node:18

WORKDIR /app/quick_poll

COPY package*.json ./
RUN [ "npm", "ci", "--omit=dev" ]

COPY . .

CMD [ "npm", "start" ]

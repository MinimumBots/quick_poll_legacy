FROM node:22

WORKDIR /app/quick_poll

COPY package*.json ./
RUN [ "npm", "ci", "--omit=dev" ]

COPY . .

ENTRYPOINT [ "npm", "start" ]

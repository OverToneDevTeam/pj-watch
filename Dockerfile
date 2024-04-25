FROM --platform=linux/x86_64 node:20

RUN mkdir /pj-watch

WORKDIR /pj-watch

COPY package*.json ./
RUN npm ci

COPY . .

CMD [ "npm", "start"]




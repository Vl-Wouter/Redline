FROM node:12.16

COPY package*.json ./
RUN npm install

RUN npm run build

# WORKDIR /redline-client/
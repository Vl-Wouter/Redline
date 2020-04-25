FROM node:12.16

COPY  ./redline-api/package*.json ./
RUN npm install

COPY ./redline-api/*.js ./

EXPOSE 4000
CMD ["npm", "run", "start"]
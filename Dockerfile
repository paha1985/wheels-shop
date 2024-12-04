FROM node:18

WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/frontend
RUN npm i
RUN npm run build

WORKDIR /usr/src/app/beckend
RUN npm i

EXPOSE 8080

CMD ["node", "index.js"]
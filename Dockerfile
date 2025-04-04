FROM node:22-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN chown node:node package-lock.json

USER node

RUN npm install

COPY --chown=node:node . .

COPY --chown=node:node bin ./bin

EXPOSE 8080

CMD [ "node", "bin/www" ]

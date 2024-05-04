FROM node:21.3.0

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./
COPY package-lock.json ./

USER root

RUN npm install

RUN npx puppeteer browsers install chrome

USER node

COPY --chown=node:node . .


EXPOSE 8081

CMD [ "node", "app.js" ]

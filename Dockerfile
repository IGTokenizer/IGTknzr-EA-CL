FROM node:21.3.0

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./
COPY package-lock.json ./

USER node

RUN npm install --force

COPY --chown=node:node . .

CMD [ "node", "app.js" ]

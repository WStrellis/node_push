FROM node:14-alpine AS npm_packages

WORKDIR /tmp

COPY package.json .
COPY package-lock.json .

RUN npm i

FROM node:14-alpine

WORKDIR /srv/push_app

COPY --from=npm_packages /tmp/node_modules  node_modules 

COPY client client
COPY index.js .
COPY src src 

CMD ["node","index.js"]
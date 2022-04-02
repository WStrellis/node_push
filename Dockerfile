FROM node:14-buster AS npm_packages

WORKDIR /tmp

COPY package.json .
COPY package-lock.json .

RUN npm i

FROM node:14-buster

WORKDIR /srv/push_app

COPY --from=npm_packages /tmp/node_modules  node_modules 

COPY client client
COPY index.js .
COPY src src 

EXPOSE 3000
CMD ["node","index.js"]
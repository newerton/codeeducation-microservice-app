FROM node:12.16.1-alpine3.11

RUN apk add --no-cache bash

RUN touch /root/.bashrc | echo "PS1='\w\$ '" >> /root/.bashrc

RUN npm config set cache /home/node/app/.npm-cache --global

RUN npm install -g nodemon
RUN npm install -g @loopback/cli@2.3.0

RUN mkdir -p /home/node/app

USER node

WORKDIR /home/node/app

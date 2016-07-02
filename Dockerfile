FROM node:6-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY node_modules /usr/src/app/node_modules
COPY src /usr/src/app/src

ENV PORT 80

EXPOSE 80
CMD [ "npm", "start" ]

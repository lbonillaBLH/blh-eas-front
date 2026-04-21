FROM node:21-alpine

COPY ./ /home/node
WORKDIR /home/node

RUN npm install
RUN npm install -g serve

### FOR RUN PRODUCTION ###

EXPOSE 3000
RUN npm run build
CMD [ "serve", "-s", "build"]
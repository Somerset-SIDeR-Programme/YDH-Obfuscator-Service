FROM node:lts-alpine

WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
COPY .env.production .
COPY ./src ./src

# git needed to install node modules from github
RUN apk --no-cache add git

RUN yarn install
CMD ["yarn", "start"]
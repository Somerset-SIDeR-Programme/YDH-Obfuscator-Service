FROM node:lts

WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
COPY .env.production .
COPY ./src ./src

# git needed to install node modules from github
RUN apt-get install git

RUN yarn install
EXPOSE 8204
CMD yarn start
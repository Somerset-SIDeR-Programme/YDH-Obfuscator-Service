FROM node:lts-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /usr/app
RUN mkdir logs && chown -R appuser:appgroup logs
COPY package.json .
COPY yarn.lock .
COPY .env.production .
COPY ./src ./src

# git needed to install node modules from github
RUN apk --no-cache add git

RUN yarn install && yarn cache clean
USER appuser
CMD ["yarn", "start"]
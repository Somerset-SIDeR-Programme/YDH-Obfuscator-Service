FROM node:lts-alpine

ARG NODE_ENV
ARG USE_HTTPS

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /usr/app
RUN mkdir logs && chown -R appuser:appgroup logs
COPY package.json .
COPY yarn.lock .
COPY .env.${NODE_ENV} .
COPY ./src ./src

# git needed to install node modules from github
RUN apk --no-cache add git

RUN if [ "${NODE_ENV}" = "production" ] ; then yarn install --production ; else yarn install ; fi && yarn cache clean
USER appuser
CMD ["yarn", "start"]
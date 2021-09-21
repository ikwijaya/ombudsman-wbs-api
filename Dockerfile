FROM node:10.22.0-alpine3.11

LABEL maintainer="OmbudsmanTeams"
LABEL appname="ombudsman-api"
LABEL version="1.0.0"

#SET ARGS
ARG NODE_ENV="production"
ARG PORT=9000
ARG APP_NAME="WBS2.0"
ARG APP_LOGO="https://wbs2.ombudsman.go.id/api/v1/others/logo/"
ARG APP_URL="http://wbs2.ombudsman.go.id/#"
ARG API_URL="http://wbs2.ombudsman.go.id/api/v1"
ARG CIPHER_KEY="3zTvzr3p67VC61jmV54rIYu1545x4TlY"
ARG CIPHER_IV="60iP0h6vJoEa"
ARG CAPTCHA="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
ARG DEBUG="1"
ARG DB_URL="postgres://postgres:g3n@dm!n@192.168.8.10:5432/wbs2_db"
ARG DB_CLIENT="postgres"
ARG DB_SCHEMA="public"
ARG DB_SSL="0"
ARG DEFAULT_PASSWORD="7654321Aa!"
ARG EMAIL_HOST="mail.ombudsman.go.id"
ARG EMAIL="no_reply@ombudsman.go.id"
ARG EMAIL_PASSWORD="rumahkaca123%"
ARG EMAIL_PORT=587
ARG EMAIL_SECURE="0"
ARG EXPIRES="12"
ARG LOGIN_INTERVAL="6h"
ARG LOG="bunyan"
ARG UPLOAD_PATH="./upload/"
ARG PERIODE="60"

# SET ENV
ENV APPDIR="/app"

# INSTALL FEATURE FOR CHECKING CONNECTION
RUN apk --no-cache add curl

# SET WORK DIRECTORY
RUN mkdir -p ${APPDIR}
WORKDIR ${APPDIR}
COPY . ${APPDIR}

# PREPARE INSTALL DEPEDENCIES
WORKDIR ${APPDIR}
RUN rm -rf .git
RUN npm install
RUN source .env.prod

## LOOK A HEAD ENV
RUN printenv

# EXPOSE FOR ACCESS FROM ANY
# EXPOSE 8080
CMD ["npm","run","start"]

# HEALTH CHECK
HEALTHCHECK --interval=5m --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1 
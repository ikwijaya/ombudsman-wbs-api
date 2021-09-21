FROM node:10.22.0-alpine3.11

LABEL maintainer="OmbudsmanTeams"
LABEL appname="ombudsman-api"
LABEL version="1.0.0"

#SET ARGS
ENV NODE_ENV="production"
ENV PORT=9000
ENV APP_NAME="WBS2.0"
ENV APP_LOGO="https://wbs2.ombudsman.go.id/api/v1/others/logo/"
ENV APP_URL="http://wbs2.ombudsman.go.id/#"
ENV API_URL="http://wbs2.ombudsman.go.id/api/v1"
ENV CIPHER_KEY="3zTvzr3p67VC61jmV54rIYu1545x4TlY"
ENV CIPHER_IV="60iP0h6vJoEa"
ENV CAPTCHA="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
ENV DEBUG="1"
ENV DB_URL="postgres://postgres:g3n@dm!n@192.168.8.10:5432/wbs2_db"
ENV DB_CLIENT="postgres"
ENV DB_SCHEMA="public"
ENV DB_SSL="0"
ENV DEFAULT_PASSWORD="7654321Aa!"
ENV EMAIL_HOST="mail.ombudsman.go.id"
ENV EMAIL="no_reply@ombudsman.go.id"
ENV EMAIL_PASSWORD="rumahkaca123%"
ENV EMAIL_PORT=587
ENV EMAIL_SECURE="0"
ENV EXPIRES="12"
ENV LOGIN_INTERVAL="6h"
ENV LOG="bunyan"
ENV UPLOAD_PATH="./upload/"
ENV PERIODE="60"

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
# RUN source /.env.prod

## LOOK A HEAD ENV
RUN printenv

# EXPOSE FOR ACCESS FROM ANY
# EXPOSE 8080
CMD ["npm","run","start"]

# HEALTH CHECK
HEALTHCHECK --interval=5m --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1 
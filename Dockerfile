FROM node:10.22.0-alpine3.11

LABEL maintainer="--123--"
LABEL appname="ombudsman-api"
LABEL version="1.0.0"

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
RUN source .env

## LOOK A HEAD ENV
RUN printenv

# EXPOSE FOR ACCESS FROM ANY
# EXPOSE 8080
CMD ["npm","run","start"]

# HEALTH CHECK
HEALTHCHECK --interval=5m --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1 
FROM node:12.22.5-alpine3.14

LABEL maintainer="OmbudsmanTeams"
LABEL appname="ombudsman-api"
LABEL version="1.0.0"

# SET ENV
ENV APPDIR="/app"

# INSTALL FEATURE FOR CHECKING CONNECTION
RUN apk --no-cache add curl python3 g++ make

# SET WORK DIRECTORY
WORKDIR ${APPDIR}
COPY . .

# PREPARE INSTALL DEPENDENCIES
RUN npm install

# EXPOSE FOR ACCESS FROM ANY
# EXPOSE 8080
ENTRYPOINT ["npm","run"]
CMD ["start"]

# HEALTH CHECK
HEALTHCHECK --interval=5m --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:9000/ || exit 1

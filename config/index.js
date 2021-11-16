
/**
 * Mapping process.env disini kemudian distributes
 */
const cfg = process.env
module.exports = {
  NODE_ENV: cfg['NODE_ENV'],
  PORT: cfg['PORT'],
  LOGIN_INTERVAL: cfg['LOGIN_INTERVAL'],
  APP_CODE: cfg['APP_NAME'],
  APP_LOGO: cfg['APP_LOGO'],
  APP_URI: cfg['APP_URL'],
  API_URL: cfg['API_URL'],
  DB_SCHEMA: cfg['DB_SCHEMA'],
  DB_URL: cfg['DB_URL'],
  DB_CLIENT: cfg['DB_CLIENT'],
  DB_SSL: cfg['DB_SSL'],
  SQ_LOG: cfg['LOG'],
  PGSSLMODE: "required",
  EMAIL_HOST: cfg['EMAIL_HOST'],
  EMAIL_PORT: cfg['EMAIL_PORT'],
  EMAIL_SECURE: cfg['EMAIL_SECURE'],
  EMAIL_AUTH: cfg['EMAIL'],
  EMAIL_PASS: cfg['EMAIL_PASSWORD'],
  EMAIL_DEBUG: cfg['DEBUG'],
  EMAIL_LOGGER: cfg['DEBUG'],
  UPLOAD_PATH: cfg['UPLOAD_PATH'],
  LOGO_PATH: `${cfg['UPLOAD_PATH']}logo/`,
  CIPHER_KEY: cfg['CIPHER_KEY'],
  CIPHER_IV: cfg['CIPHER_IV'],
  RECAPTCHA_SECRET_KEY: cfg['CAPTCHA'],
  DEFAULT_PASSWD: cfg["DEFAULT_PASSWORD"],
  EXPIRES_IN: cfg["EXPIRES_IN"],
  PRODUCT_MODE: [5, 9, 10],
  PERIODE: cfg['PERIODE']
}
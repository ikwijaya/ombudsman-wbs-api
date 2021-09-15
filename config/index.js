
/**
 * Gegara ga bisa pake ENV VARIABLES
 * DB_URL: "mysql://k0026803_wbs:nhO9cFg!P}pI@103.82.241.96:3306/k0026803_wbs",
 */
const cfg = process.env

module.exports = {
  NODE_ENV: "uat",
  PORT: "9000",
  HTTP_TIMEOUT: "12000",
  LOGIN_INTERVAL: "6h",
  APP_CODE: "WBS2.0",
  APP_LOGO: "https://wbs2.ombudsman.go.id/api/v1/others/logo/",
  APP_URI: "https://wbs2.ombudsman.go.id/#",
  API_URL: "https://wbs2.ombudsman.go.id/api/v1",
  DB_SCHEMA: 'public',//cfg.DB_SCHEMA,
  // DB_URL: cfg.DATABASE_URL,
  DB_URL: "postgres://postgres:g3n@dm!n@192.168.8.10:5432/wbs2_db",
  DB_CLIENT: "postgres",
  DB_SSL: "0",
  SQ_SYNC: "0",
  SQ_ALTER: "1",
  SQ_FORCE: "0",
  SQ_LOG: "bunyan",
  SQ_SEED: "0",
  PGSSLMODE: "required",
  EMAIL_SERVICE: "gmail",
  EMAIL_HOST: "mail.kuyngoding.my.id",
  EMAIL_PORT: "587",
  EMAIL_SECURE: "0",
  EMAIL_AUTH: "no-reply@kuyngoding.my.id",
  EMAIL_PASS: "4qQ_4CTsl9Ct",
  EMAIL_DEBUG: "1",
  EMAIL_LOGGER: "0",
  UPLOAD_PATH: "./images/",
  LOGO_PATH: "./images/logo/",
  CIPHER_KEY: "3zTvzr3p67VC61jmV54rIYu1545x4TlY",
  CIPHER_IV: "60iP0h6vJoEa",
  // RECAPTCHA_SECRET_KEY: "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe",  // testing
  RECAPTCHA_SECRET_KEY: "6LcAfcYbAAAAAOvCvrDdKrHLbP2Bh2U5NyHjBnBv",     // prod
  DEFAULT_PASSWD: "7654321Aa",
  EXPIRES_IN: "12",
  PRODUCT_MODE: [5, 9, 10],
}
import { config as loadENVs } from "dotenv";
loadENVs();
export const configurationFile = {
  production: {
    mongoUrl: process.env.MONGO_URL_PROD
  },
  staging: {
    mongoUrl: process.env.MONGO_URL_STAGING,
    PRIVKEY_CERT_LOC: "/etc/nginx/ssl/nginx.crt",
    FULLCHAIN_CERT_LOC: "/etc/nginx/ssl/nginx.key"
  },
  development: {
    mongoUrl: `mongodb://mongo:27017/poc`
  },
  test: {
    mongoUrl: process.env.MONGO_URL_TEST
  },
  CLOUDWATCH_LOGGER: {
    logGroupName: process.env.CLOUDWATCH_LOG_GROUP,
    accessKeyId: process.env.CLOUDWATCH_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDWATCH_SECRET_KEY,
    region: process.env.REGION
  }
};
export const logType = {
  cloudWatch: false,
  file: true
};

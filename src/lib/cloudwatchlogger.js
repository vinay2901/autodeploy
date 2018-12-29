import * as constants from "../lib/constants";
import { configurationFile } from "../lib/config";
import winston from "winston";
import CloudWatchTransport from "winston-aws-cloudwatch";

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: true,
      colorize: true
    })
  ]
});
const config = {
  logGroupName: configurationFile.CLOUDWATCH_LOGGER.logGroupName,
  logStreamName: constants.ENVIRONMENT,
  createLogGroup: false,
  createLogStream: true,
  awsConfig: {
    accessKeyId: configurationFile.CLOUDWATCH_LOGGER.accessKeyId,
    secretAccessKey: configurationFile.CLOUDWATCH_LOGGER.secretAccessKey,
    region: configurationFile.CLOUDWATCH_LOGGER.region
  },
  formatLog: function(item) {
    return item.level + ": " + item.message + " " + JSON.stringify(item.meta);
  }
};
logger.add(CloudWatchTransport, config);
logger.level = process.env.LOG_LEVEL || "error";
logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};
export default logger;

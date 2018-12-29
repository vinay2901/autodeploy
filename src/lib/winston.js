import { transports as _transports, Logger } from "winston";
import "winston-daily-rotate-file";

import { logType } from "./config";
import express from "express";
import fs from "fs";
import path from "path";
import httpContext from "express-http-context";

export const LOGDIR = process.env["API_LOGS_DIR"] || "logs";

if (!fs.existsSync(LOGDIR)) {
  fs.mkdirSync(LOGDIR);
}
let logEnabled = !logType.file ? true : false;
if (process.env["NODE_ENV"] === "test") {
  logEnabled = true;
}
let options = {
  file: {
    level: "silly",
    filename: path.join(LOGDIR, "app.log"),
    handleExceptions: true,
    json: false,
    tailable: true,
    maxsize: 5242880, // 5MB
    colorize: false,
    silent: logEnabled
  },
  dailyFile: {
    filename: path.join(LOGDIR, "app.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    handleExceptions: true,
    json: false,
    colorize: false,
    silent: logEnabled,
    tailable: true
  },
  console: {
    level: "silly",
    handleExceptions: true,
    json: false,
    colorize: true,
    silent: logEnabled,
    timestamp: true
  }
};

const transports = [new _transports.DailyRotateFile(options.dailyFile)];

if (
  process.env["NODE_ENV"] === "test" ||
  process.env["NODE_ENV"] === "development"
) {
  transports.push(new _transports.Console(options.console));
}

const wlogger = new Logger({
  transports,
  exitOnError: false
});

const formatMessage = function(message) {
  const reqId = httpContext.get("reqId");
  message = reqId ? `${message} reqId: ${reqId}` : message;
  return message;
};
export const logger = {
  log: function(level, message) {
    wlogger.log(level, formatMessage(message));
  },
  error: function(message) {
    wlogger.error(formatMessage(message));
  },
  warn: function(message) {
    wlogger.warn(formatMessage(message));
  },
  verbose: function(message) {
    wlogger.verbose(formatMessage(message));
  },
  info: function(message) {
    wlogger.info(formatMessage(message));
  },
  debug: function(message) {
    wlogger.debug(formatMessage(message));
  },
  silly: function(message) {
    wlogger.silly(formatMessage(message));
  }
};

const loggerstream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};
//app.use(require("morgan")("combined", { stream: loggerstream }));

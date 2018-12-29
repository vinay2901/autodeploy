// Defines an express app that runs the boilerplate codebase.

import "babel-polyfill";
import express from "express";
import compression from "compression";
import https from "https";
import http from "http";
import fs from "fs";
import cors from "cors";
import { getEnv } from "./lib/env";
import { logger } from "./lib/winston";
import createRouter from "./router";
const app = express();
app.use(cors({ origin: "*" }));
app.use(compression());
app.use(createRouter());
logger.info(getEnv("NODE_ENV"));
const port = 8000;
const sslOptions = {
  key: fs.readFileSync("./ssl/nginx.key"),
  cert: fs.readFileSync("./ssl/nginx.crt")
};
console.log(
  "-----",
  process.env.MONGODB_PORT_27017_TCP_ADDR,
  process.env.MONGODB_PORT_27017_TCP_PORT,
  process.env
);
http
  .createServer(app)
  .listen(3000, () => logger.info(`http is running on 3000`));
https
  .createServer(sslOptions, app)
  .listen(port, () => logger.info(`https is Listening on port ${port}`));

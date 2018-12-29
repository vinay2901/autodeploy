// Defines an express app that runs the boilerplate codebase.

import bodyParser from "body-parser";
import express from "express";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import { configurationFile } from "./lib/config";
import { ApplicationError } from "./lib/errors";
import { cloudWatchLogger } from "./lib/utils";
import { STATUS_CODES } from "./lib/statusCodes";
import helmet from "helmet";
import { verify as verifyMiddleware } from "./routes/sessions";
import fileUpload from "express-fileupload";
import { logger, LOGDIR } from "./lib/winston";
import morgan from "morgan";
import rfs from "rotating-file-stream";
import httpContext from "express-http-context";
import uuid from "uuid";
import { getAllQuestions, askQuestions } from "./routes/question";
import { buildSchema } from "graphql";
const app = express();
export default function createRouter() {
  // *********
  // * SETUP *
  // *********

  const router = express.Router();

  // static assets, served from "/public" on the web
  router.use("/public", express.static(path.join(__dirname, "..", "public")));

  router.use(cookieParser()); // parse cookies automatically
  router.use(bodyParser.json()); // parse json bodies automatically\
  router.use(helmet());

  router.use(httpContext.middleware);
  router.use(function(req, res, next) {
    httpContext.set("reqId", uuid.v1());
    next();
  });

  let loggerFormat = '[:date[web]] ":method :url" :status :response-time';

  let accessLogStream = rfs("access.log", {
    interval: "1d",
    path: LOGDIR
  });

  // setup the logger
  router.use(morgan("combined", { stream: accessLogStream }));

  if (
    process.env["NODE_ENV"] === "test" ||
    process.env["NODE_ENV"] === "development"
  ) {
    router.use(
      morgan(loggerFormat, {
        skip: function(req, res) {
          return res.statusCode < 400;
        },
        stream: process.stderr
      })
    );
    router.use(
      morgan(loggerFormat, {
        skip: function(req, res) {
          return res.statusCode >= 400;
        },
        stream: process.stdout
      })
    );
  }

  /**
   * Uncached routes:
   * All routes that shouldn't be cached (i.e. non-static assets)
   * should have these headers to prevent 304 Unmodified cache
   * returns. This middleware applies it to all subsequently
   * defined routes.
   */
  router.get("/*", (req, res, next) => {
    res.set({
      "Last-Modified": new Date().toUTCString(),
      Expires: -1,
      "Cache-Control": "must-revalidate, private"
    });
    next();
  });

  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(fileUpload());
  // *****************
  // * API ENDPOINTS *
  // *****************

  /*
   * sessions endpoints
   */
  // authenticate. Returns a json web token to use with requests.

  router.get("/", function(req, res) {
    res.send({ message: "welcome" });
  });
  router.get("/questions", getAllQuestions);
  router.post("/questions", askQuestions);

  // ******************
  // * ERROR HANDLING *
  // ******************

  // 404 route
  router.all("/*", (req, res, next) => {
    //next(new ApplicationError("Not Found", 404));
    return res.status(404).send({
      message: "Not Found"
    });
  });

  // catch all ApplicationErrors, then output proper error responses.
  //
  // NOTE: express relies on the fact the next line has 4 args in
  // the function signature to trigger it on errors. So, don't
  // remove the unused arguments!
  router.use((err, req, res, next) => {
    // Log the error in CloudWatch
    cloudWatchLogger(
      err,
      req.body.userId || "",
      req.headers.deviceinformation || "",
      req.url
    );
    logger.error(
      `${err.statusCode || 500} - ${err.message} - ${req.url} - ${
        req.method
      } - ${req.body.userId || ""} `
    );
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).send({
        // data: err.data || {},
        // message: { errMsg: err.message, errCode: err.statusCode }
        //...STATUS_CODES[3003]
      });
      return;
    }
    // If we get here, the error could not be handled.
    // Log it for debugging purposes later.
    res.status(500).send({
      message: "Uncaught error"
    }); // uncaught exception
  });

  // *******************
  // * CATCH ALL ROUTE *
  // *******************

  /**
   * If you want all other routes to render something like a one-page
   * frontend app, you can do so here; else, feel free to delete
   * the following comment.
   */
  /*
   * function renderFrontendApp(req, res, next) {
   *   // TODO: add code to render something here
   * }
   * // all other pages route to the frontend application.
   * router.get('/*', renderFrontendApp);
   */

  return router;
}

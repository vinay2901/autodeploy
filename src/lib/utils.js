import requestify from "requestify";
import nodemailer from "nodemailer";
import * as constants from "../lib/constants";
/* eslint-disable */
import logger from "../lib/cloudwatchlogger";
/* eslint-enable */
export const createRandomNumber = GROUP_ID_PREFIX => {
  let rand = Math.random()
    .toString(36)
    .substr(2, 16);
  return GROUP_ID_PREFIX + rand;
};

export const sendEmail = async (email, subject, messageToSend) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: constants.EMAIL.userName,
      pass: constants.EMAIL.password
    }
  });
  var mailOptions = {
    from: constants.EMAIL.userName,
    to: email,
    subject: subject,
    text: messageToSend
  };
  return await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw error;
    }
  });
};

export const sendHtmlEmail = async (email, subject, messageToSend) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: constants.EMAIL.userName,
      pass: constants.EMAIL.password
    }
  });
  var mailOptions = {
    from: `Team Basis <${constants.EMAIL.userName}>`,
    to: email,
    subject: subject,
    html: messageToSend
  };
  return await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw error;
    }
  });
};

export const externalApiRequest = async (
  url,
  method,
  body = null,
  headers = null,
  dataType = null
) => {
  try {
    const response = await requestify.request(url, {
      method,
      body,
      headers,
      dataType
    });
    return {
      code: response.getCode(),
      headers: response.getHeaders(),
      body: response.getBody()
    };
  } catch (err) {
    return {
      code: err.getCode(),
      headers: err.getHeaders(),
      body: err.getBody()
    };
  }
};

export const getVerificationCode = () =>
  Math.floor(Math.random() * 8999 + 1000);

export const cloudWatchLogger = (
  error,
  userId,
  deviceInformation,
  functionName
) => {
  if (constants.ENVIRONMENT === constants.TEST) {
    return;
  }
  const errorLog = {
    source: constants.ENVIRONMENT,
    type: "api_error",
    payload: {
      errorMessage: error.message || "",
      errorCode: error.code || "500",
      errorDetails: JSON.stringify(error)
    },
    context: {
      time: Date.now(),
      userId: userId,
      deviceInformation: deviceInformation
    }
  };
  logger.log("error", errorLog, { tags: functionName });
};

export const validateObject = (keysToBeValidated, ObjectToBeValidated) =>
  keysToBeValidated.reduce(
    (xs, x) => (xs && xs[x] ? xs[x] : null),
    ObjectToBeValidated
  );

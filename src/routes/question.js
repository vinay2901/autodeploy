import { route } from "./";
import QuestionModel from "../db/QuestionModel";
import { STATUS_CODES } from "../lib/statusCodes";
/*eslint-disable*/
import { logger } from "../lib/winston";
/*eslint-enable*/

export const askQuestions = route(async (req, res) => {
  const questionModel = new QuestionModel();
  try {
    logger.info(`questonJs-getAllQuestions `);
    const questions = await questionModel.create(req.body);
    res.send({ results: questions });
  } catch (error) {
    logger.error(`questonJs-getAllQuestions ${error}`);
    res.send(error);
  }
});

export const getAllQuestions = route(async (req, res) => {
  const questionModel = new QuestionModel();
  try {
    logger.info(`questonJs-getAllQuestions `);
    const questions = await questionModel.getAllQuestions();
    res.send({ results: questions });
  } catch (error) {
    logger.error(`questonJs-getAllQuestions ${error}`);
    return;
  }
});

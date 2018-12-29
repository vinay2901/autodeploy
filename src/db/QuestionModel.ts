import BaseModel from "./BaseModel";
import { default as questionSchema } from "../schemas/questions.schema";
import { logger } from "../lib/winston";

interface Question {
  question: string;
  tags: Array<string>;
}
export default class VersionModel extends BaseModel {
  schema: any;
  name: string;
  model: any;
  constructor() {
    super("question");
    this.name = "question";
    this.model = this.connection.model(this.name, questionSchema);
  }
  async getVersions(): Promise<Object> {
    try {
      const version = await this.model
      .findOne({}, { _id: 0 });
      if (!version) {
        return {};
      } else {
        return version;
      }
    } catch (error) {
      throw    error;
    }
  }

  async getAllQuestions(): Promise<Object> {
    try {
      logger.info(`questionModel-getAllQuestion`);
      const questions = await this.model.find();
      return questions;
    } catch (error) {
      logger.error(`questionModel-getAllQuestion ${error}`);
      throw error;
    }
  }

  async create(question: Question): Promise<Object> {
    try {
      logger.info(`questionModel-create`);
      const questions = await this.model.create(question);
      return questions;
    } catch (error) {
      logger.error(`questionModel-create ${error}`);
      throw error;
    }
  }
}

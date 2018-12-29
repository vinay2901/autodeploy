import mongoose from "mongoose";
import uuid from "uuid";
import * as constants from "../lib/constants";
const Question = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  question: { type: String },
  tags: { type: Array },
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

export default Question;

const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  useNewUrlParser: true
};
import mongoose from "mongoose";
import { configurationFile } from "../lib/config.js";

//Below will be dynamic based on the environment
console.log("----",configurationFile[process.env["NODE_ENV"]].mongoUrl)
const mongooseDb = mongoose.connect(
  configurationFile[process.env["NODE_ENV"]].mongoUrl,
  options
);

export default class BaseModel {
  schema: any;
  name: string;
  connection: any;
  constructor(name) {
    this.name = name;
    if (mongooseDb) {
      this.connection = mongoose.connection;
    }
  }
}

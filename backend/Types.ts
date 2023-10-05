import {clearScreenDown} from "readline";
import {StatusCodes} from "http-status-codes";
import {MongoError} from "mongodb";

export interface User {
  username: string,
  email: string,
  password: string
}


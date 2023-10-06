import {clearScreenDown} from "readline";
import {StatusCodes} from "http-status-codes";
import {MongoError} from "mongodb";


export interface SignInUser {
  username: string,
  password: string
}

export interface User extends SignInUser {

  email: string,

}


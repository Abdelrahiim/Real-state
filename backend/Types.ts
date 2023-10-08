import {clearScreenDown} from "readline";
import {StatusCodes} from "http-status-codes";
import {MongoError} from "mongodb";


export interface SignInUser {
  email: string,
  password: string
}

export interface User extends SignInUser {
  username: string,
  avatar?:string
}

export interface GoogleSignInUser{
  username:string
  email:string
  photoURL:string
}


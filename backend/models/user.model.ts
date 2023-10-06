import UserModel from './user.mongo.ts'
import {User} from "../Types.ts";
import {Types} from "mongoose"
import {HTTPException} from "../middlewares/error.middleware.ts";
import {StatusCodes} from "http-status-codes";
import {SignJWT} from "jose";
import {ALGORITHM, EXPIRE, SECRET_KEY} from "../services/Settings.ts";
import {token} from "morgan";


async function saveUser(user: User) {
  return await UserModel.create(user)

}

async function createNewUser(user: User) {
  user.password = await Bun.password.hash(user.password)
  return await saveUser(user)
}

async function authenticate(username: string, password: string) {
  const validUser = await UserModel.findOne({username});
  if (!validUser) {
    throw new HTTPException("Invalid Credentials", StatusCodes.FORBIDDEN)
  }
  const isPasswordMatch = await Bun.password.verify(password, validUser.password)

  if (!isPasswordMatch) {
    throw new HTTPException("Invalid Credentials", StatusCodes.FORBIDDEN)
  }
  // @ts-ignore
  const {password:pass,...rest } = validUser._doc
  return [await obtainToken(validUser._id) , rest ]
}

async function obtainToken(userId: Types.ObjectId) {
  const jwtToken = await new SignJWT({userId}).setProtectedHeader({alg: ALGORITHM}).setExpirationTime(EXPIRE)
    .sign(new TextEncoder().encode(SECRET_KEY))
  console.log(jwtToken)
  return jwtToken

}

// Just For Development
async function listAllUsers() {
  return UserModel.find({}, {username: 1, _id: 1, email: 1});
}


export {
  createNewUser,
  authenticate,
  listAllUsers
}
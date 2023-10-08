import UserModel from './user.mongo.ts'
import {GoogleSignInUser, User} from "../Types.ts";
import {Types} from "mongoose"
import {HTTPException} from "../middlewares/error.middleware.ts";
import {StatusCodes} from "http-status-codes";
import {SignJWT} from "jose";
import {ALGORITHM, EXPIRE, SECRET_KEY} from "../services/Settings.ts";
import {faker, tr} from "@faker-js/faker";
import {getUserNameFromDisplayName} from "../services/utils.ts";


async function saveUser(user: User) {
  return await UserModel.create(user)
}

async function createNewUser(user: User) {
  user.password = await Bun.password.hash(user.password)
  const newUser = await saveUser(user)
  // @ts-ignore
  const {password: pass, ...rest} = newUser._doc
  return [await obtainToken(newUser._id), rest];
}

interface GenericFilter<T> {
  [key: string]: T;
}

/**
 * Allow To Find One Instance With Some filter
 * @param filter GenericFilter
 */
async function findUser<T>(filter: GenericFilter<T>) {
  return UserModel.findOne(filter);
}

async function authenticate(email: string, password: string) {
  const validUser = await findUser({email});
  if (!validUser) {
    throw new HTTPException("Invalid Credentials", StatusCodes.FORBIDDEN)
  }
  const isPasswordMatch = await Bun.password.verify(password, validUser.password)

  if (!isPasswordMatch) {
    throw new HTTPException("Invalid Credentials", StatusCodes.FORBIDDEN)
  }
  // @ts-ignore
  const {password: pass, ...rest} = validUser._doc
  return [await obtainToken(validUser._id), rest]
}


async function authenticateWithGoogle(userData: GoogleSignInUser) {
  try {
    const user = await findUser({email: userData.email})

    if (user) {
      // @ts-ignore
      const {password: pass, ...rest} = user._doc
      const token = await obtainToken(user._id)
      return [await obtainToken(user._id), rest]
    }
    const newUser: User = {
      username: getUserNameFromDisplayName(userData.username),
      email: userData.email,
      password: faker.internet.password(),
      avatar: userData.photoURL
    }
    return await createNewUser(newUser)
  } catch (e: any) {
    throw new HTTPException(e.message, StatusCodes.UNAUTHORIZED)
  }
}

async function obtainToken(userId: Types.ObjectId) {
  return await new SignJWT({userId}).setProtectedHeader({alg: ALGORITHM}).setExpirationTime(EXPIRE)
    .sign(new TextEncoder().encode(SECRET_KEY))

}

async function updateUserInfo(id: string, user: User) {
  try {
    if (user.password) {
      user.password = await Bun.password.hash(user.password)
    }
    const updatedUser = await UserModel.findByIdAndUpdate(id, {
      $set: {
        username: user.username,
        password: user.password,
        email: user.email,
        avatar: user.avatar
      }
    },{new:true})
    // @ts-ignore
    const {password,...rest} = updatedUser._doc

    return rest
  } catch (e: any) {
    throw new HTTPException(e.message, StatusCodes.NOT_FOUND)
  }
}


async function deleteUser(id:string){
  try {
    const deletedUser = await UserModel.findByIdAndDelete(id)
  } catch (e:any) {
    console.log(e)
    throw new HTTPException(e.message,StatusCodes.NOT_FOUND)
  }
}


// Just For Development
async function listAllUsers() {
  return UserModel.find({}, {username: 1, _id: 1, email: 1});
}


export {
  createNewUser,
  authenticate,
  authenticateWithGoogle,
  listAllUsers,
  findUser,
  updateUserInfo,
  deleteUser
}
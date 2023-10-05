import UserModel from './user.mongo.ts'
import { User} from "../Types.ts";
import {MongoError} from "mongodb";


async function saveUser(user: User) {
  return await UserModel.create(user)

}

async function createNewUser(user: User) {
  user.password = await Bun.password.hash(user.password)
  return await saveUser(user)
}


// Just For Development
async function listAllUsers() {
  return UserModel.find({}, {username: 1, _id: 1, email: 1});
}


export {
  createNewUser,
  listAllUsers
}
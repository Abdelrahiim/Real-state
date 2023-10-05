import UserModel from './user.mongo.ts'
import {User} from "../Types.ts";



async function saveUser(user:User){
  return await UserModel.create(user)
}
async function createNewUser(user:User){
  user.password = await Bun.password.hash(user.password)
  return await  saveUser(user)
}


async function listAllUsers(){
  return UserModel.find();
}



export {
  createNewUser,
  listAllUsers
}
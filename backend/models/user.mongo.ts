import {Schema, model} from "mongoose";
import {User} from "../Types.ts";
import {faker} from "@faker-js/faker";

const userSchema = new Schema<User>({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  avatar:{
    type:String,
    default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-pVE9ndx8sFOBJmm-_Gxk1t9YbbcteAfm4Gw6zgY&s"
  }
}, {timestamps: true})

export default model("User", userSchema)
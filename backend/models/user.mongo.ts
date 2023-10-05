import {Schema, model} from "mongoose";
import {User} from "../Types.ts";

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
}, {timestamps: true})

export default model("User", userSchema)
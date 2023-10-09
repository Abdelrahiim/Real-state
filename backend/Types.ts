
import { Types} from "mongoose";


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

export interface Listing{
  name:string
  address:string
  description:string
  regularPrice:number
  discountPrice:number
  bathrooms:number
  bedrooms:number
  furnished:boolean
  parking:boolean
  type:string
  offer:boolean
  imageURL:Types.Array<string>
  userRef:string | Types.ObjectId
}
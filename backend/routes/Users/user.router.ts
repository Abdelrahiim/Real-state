import {Router} from "express";
import UserController from "./user.controller.ts";


const UserRouter = Router();

UserRouter.post("/auth/sign-up/",UserController.signUp)
UserRouter.post("/auth/sign-in/",UserController.signIn)
UserRouter.post("/auth/google",UserController.signInWithGoogle )
// just For
UserRouter.get('/',UserController.list)

export default UserRouter
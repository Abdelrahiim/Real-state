import {Router} from "express";
import UserController from "./user.controller.ts";


const UserRouter = Router();

UserRouter.post("/auth/sign-up/",UserController.signUp)
// just For Development
UserRouter.get("/",UserController.list)


export default UserRouter
import {Router} from "express";
import UserController from "./user.controller.ts";


const UserRouter = Router();

UserRouter.post("/",UserController.signUp)
UserRouter.get("/",UserController.list)


export default UserRouter
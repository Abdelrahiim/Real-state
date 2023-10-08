import {Router} from "express";
import UserController from "./user.controller.ts";
import VerifyTokenMiddleware from "../../middlewares/verifyToken.middleware.ts";


const UserRouter = Router();

UserRouter.post("/auth/sign-up/",UserController.signUp)
UserRouter.post("/auth/sign-in/",UserController.signIn)
UserRouter.post("/auth/google",UserController.signInWithGoogle )

UserRouter.put("/update/:id",VerifyTokenMiddleware,UserController.update)
UserRouter.delete("/delete/:id",VerifyTokenMiddleware,UserController.destroy)
// just For
UserRouter.get('/',VerifyTokenMiddleware,UserController.list)

export default UserRouter
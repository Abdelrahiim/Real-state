import {Router} from "express";
import ListingController from "./listing.controller.ts";
import VerifyTokenMiddleware from "../../middlewares/verifyToken.middleware.ts";



const ListingRouter = Router()

ListingRouter.post("/",VerifyTokenMiddleware,ListingController.create)
ListingRouter.get("/",VerifyTokenMiddleware,ListingController.list)
ListingRouter.delete("/:id",VerifyTokenMiddleware,ListingController.destroy)

export default ListingRouter
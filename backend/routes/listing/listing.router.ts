import {Router} from "express";
import ListingController from "./listing.controller.ts";
import VerifyTokenMiddleware from "../../middlewares/verifyToken.middleware.ts";



const ListingRouter = Router()

ListingRouter.post("/",VerifyTokenMiddleware,ListingController.create)
ListingRouter.get("/",VerifyTokenMiddleware,ListingController.list)
ListingRouter.get("/:id",ListingController.retrieve)
ListingRouter.delete("/:id",VerifyTokenMiddleware,ListingController.destroy)
ListingRouter.put("/:id",VerifyTokenMiddleware,ListingController.update)

export default ListingRouter
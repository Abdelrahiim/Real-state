import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {createNewListing} from "../../models/listing.model.ts";
import {Listing} from "../../Types.ts";
import {HTTPException} from "../../middlewares/error.middleware.ts";

async function create(req: Request<{}, {}, Listing>, res: Response) {

  try {
    // @ts-ignore
    const newListing = await createNewListing({userRef:req.userId,...req.body})
    return res.status(StatusCodes.OK).json(newListing);
  } catch (e: any) {
    return res.status(e.statusCode).json({error: e.message})
  }

}



export default {
  create
}
import ListingModel from "./listing.mongo.ts";
import {Listing} from "../Types.ts";
import {HTTPException} from "../middlewares/error.middleware.ts";
import {StatusCodes} from "http-status-codes";

async function createNewListing(listing:Listing){
  try {
    return await ListingModel.create(listing)
  }
  catch (e:any){
    throw new HTTPException(e.message,StatusCodes.BAD_REQUEST)
  }
}





export  {
  createNewListing
}
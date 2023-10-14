import ListingModel from "./listing.mongo.ts";
import {Listing} from "../Types.ts";
import {HTTPException} from "../middlewares/error.middleware.ts";
import {StatusCodes} from "http-status-codes";

async function createNewListing(listing: Listing) {
  try {
    return await ListingModel.create(listing)
  } catch (e: any) {
    throw new HTTPException(e.message, StatusCodes.BAD_REQUEST)
  }
}

async function getUserListing(userId: string) {
  try {
    return await ListingModel.find({userRef: userId})

  } catch (e: any) {
    throw new HTTPException(e.message, StatusCodes.NOT_FOUND)
  }
}

async function findListing(id: string) {
  try {
    return await ListingModel.findById(id)
  } catch (e) {
    throw new HTTPException("Not Found", StatusCodes.NOT_FOUND)
  }
}

async function deleteListing(id: string, userId: string) {
  try {
    const listing = await findListing(id)
    if (listing?.userRef.toString() !== userId) {
      throw new HTTPException("You Can only delete Your own listings", StatusCodes.BAD_REQUEST)
    }
    await ListingModel.findByIdAndDelete(id)
  } catch (e: any) {
    throw new HTTPException(e.message, StatusCodes.NOT_FOUND)
  }

}

export {
  createNewListing,
  getUserListing,
  deleteListing
}
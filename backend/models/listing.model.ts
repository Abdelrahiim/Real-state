import ListingModel from "./listing.mongo.ts";
import {Listing} from "../Types.ts";
import {HTTPException} from "../middlewares/error.middleware.ts";
import {StatusCodes} from "http-status-codes";
import mongoose from "mongoose";

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


export {
  createNewListing,
  getUserListing
}
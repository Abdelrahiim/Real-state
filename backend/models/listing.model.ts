import ListingModel from "./listing.mongo.ts";
import {Listing, ListingResponse} from "../Types.ts";
import {HTTPException} from "../middlewares/error.middleware.ts";
import {StatusCodes} from "http-status-codes";
import {createNewListingDocument, deleteListingDocument, updateListingDocument} from "../services/MeiliSearch.ts";
import {Document, Types} from "mongoose";

async function createNewListing(listing: Listing) {
  try {
    const newListing =   await ListingModel.create(listing)
    await createNewListingDocument(newListing)
    return newListing
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

async function updateListing(id:string,userId:string,data:Listing){
  try {
    const listing = await findListing(id)
    if (listing?.userRef.toString() !== userId) {
      throw new HTTPException("You Can only delete Your own listings", StatusCodes.BAD_REQUEST)
    }
    const updatedListing =  await ListingModel.findByIdAndUpdate(listing._id,data,{new:true})
    await updateListingDocument(updatedListing as (Document<unknown, {}, Listing> & Listing & {_id: Types.ObjectId}))
    return updatedListing
  } catch (e:any){
    throw new HTTPException(e.message, e.statusCode || StatusCodes.NOT_FOUND)
  }
}
async function deleteListing(id: string, userId: string) {
  try {
    const listing = await findListing(id)
    if (listing?.userRef.toString() !== userId) {
      throw new HTTPException("You Can only delete Your own listings", StatusCodes.BAD_REQUEST)
    }
    await ListingModel.findByIdAndDelete(id)
    await deleteListingDocument(id)
  } catch (e: any) {
    throw new HTTPException(e.message, e.statusCode || StatusCodes.NOT_FOUND)
  }

}

async function getAllListing(){
  return ListingModel.find()
}


export {
  createNewListing,
  getUserListing,
  deleteListing,
  updateListing,
  findListing,
  getAllListing,
}
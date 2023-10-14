import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {
  createNewListing,
  deleteListing,
  findListing,
  getUserListing,
  updateListing
} from "../../models/listing.model.ts";
import {Listing} from "../../Types.ts";
import {HTTPException} from "../../middlewares/error.middleware.ts";

async function create(req: Request<{}, {}, Listing>, res: Response) {
  try {
    // @ts-ignore
    const newListing = await createNewListing({userRef: req.userId, ...req.body})
    return res.status(StatusCodes.OK).json(newListing);
  } catch (e: any) {
    return res.status(e.statusCode).json({error: e.message})
  }
}

async function list(req: Request, res: Response) {
  try {
    // @ts-ignore
    const userListings = await getUserListing(req.userId)
    return res.status(StatusCodes.OK).json(userListings)
  } catch (e: any) {
    return res.status(e.statusCode).json({error: e.message})
  }
}

async function retrieve(req: Request<{ id: string }>, res: Response) {
  try {
    const listing = await findListing(req.params.id)
    return res.status(StatusCodes.OK).json(listing)
  } catch (e: any) {
    return res.status(e.statusCode).json({error: e.message})
  }
}

async function update(req: Request<{ id: string }, {}, Listing>, res: Response) {
  try {
    // @ts-ignore
    const updatedListing = await updateListing(req.params.id, req.userId, req.body)
    return res.status(StatusCodes.ACCEPTED).json(updatedListing)
  } catch (e: any) {
    return res.status(e.statusCode).json({error: e.message})
  }
}

async function destroy(req: Request<{ id: string }>, res: Response) {
  try {
    // @ts-ignore
    await deleteListing(req.params.id, req.userId)
    return res.sendStatus(StatusCodes.OK)
  } catch (e: any) {
    return res.status(e.statusCode).json({error: e.message})
  }
}


export default {
  create, list, destroy, update, retrieve
}
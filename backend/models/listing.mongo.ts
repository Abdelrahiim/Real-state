import {Schema, model} from "mongoose";
import {Listing} from "../Types.ts";

const listingSchema = new Schema<Listing>({
  address: {
    type: String,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  discountPrice: {
    type: Number,
    required: true
  },
  furnished: {
    type: Boolean,
    required: true
  },
  imageURL: {
    type: [String],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  offer: {
    type: Boolean,
    required: true
  },
  parking: {
    type: Boolean,
    required: true
  },
  regularPrice: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  userRef: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

},{timestamps:true})


const ListingModel = model("Listing",listingSchema)

export default ListingModel
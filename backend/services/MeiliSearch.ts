import {MeiliSearch} from 'meilisearch'
import {ListingResponse} from "../Types.ts";
import {HTTPException} from "../middlewares/error.middleware.ts";
import {StatusCodes} from "http-status-codes";


const client = new MeiliSearch({
  host: 'http://localhost:7700',
  apiKey: process.env.MASTER_KEY as string
})


const ListingIndex = client.index("listing")

async function settingUpMeiliSearch() {
  await ListingIndex.updateSearchableAttributes([
    "address",
    "description",
    "name",
  ])
  await ListingIndex.updateFilterableAttributes([
    "type",
    "parking",
    "furnished",
    "offer"
  ])
  await ListingIndex.updateSortableAttributes(["regularPrice", "createdAt"])
}

async function searchAndFilter(
  searchTerm: string,
  limit: number = 10,
  offer: string,
  parking: string,
  furnished: string,
  type: string,
  sort: string,
  order: string) {
  try {
    return await ListingIndex.search(searchTerm, {
      limit: limit,
      filter: [offer, furnished, parking, type],
      sort: [`${sort}:${order}`]
    })
  } catch (e: any) {
    throw new HTTPException(e.message, StatusCodes.NOT_FOUND)
  }

}

async function createNewListingDocument(listing: ListingResponse) {
  await ListingIndex.addDocuments([listing])
}

async function updateListingDocument(listing: ListingResponse) {
  await ListingIndex.updateDocuments([listing])
}

async function deleteListingDocument(id: string) {
  await ListingIndex.deleteDocument(id)
}


export {
  settingUpMeiliSearch,
  createNewListingDocument,
  updateListingDocument,
  deleteListingDocument,
  searchAndFilter
}
export default client

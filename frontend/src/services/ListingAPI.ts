import {createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {baseUrl, ListingResponse} from "../api.ts";



export const ListingAPI = createApi(
  {
    reducerPath:"ListingAPI",
    refetchOnMountOrArgChange:true,
    baseQuery:fetchBaseQuery({
      baseUrl:baseUrl,
      cache:"no-cache"
    }),
    endpoints: (builder) => ({
      getListingDetails:builder.query<ListingResponse,string>({
        query: (listingId) => (`/listing/${listingId}`),
      }),
      getUserListing:builder.query<ListingResponse[],null>({
        query: () => (`/listing`),
      }),

    })
  }
)
export const {
  useGetListingDetailsQuery,useGetUserListingQuery
} = ListingAPI

import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {baseUrl, ListingResponse, User} from "../../api.ts";


export const ListingAPI = createApi(
  {
    reducerPath: "ListingAPI",
    refetchOnMountOrArgChange: true,
    baseQuery: fetchBaseQuery({
      baseUrl: baseUrl,
      cache: "no-cache"
    }),
    endpoints: (builder) => ({
      getListingDetails: builder.query<ListingResponse, string>({
        query: (listingId) => (`/listing/${listingId}`),
      }),
      getUserListing: builder.query<ListingResponse[], null>({
        query: () => (`/listing`),
      }),
      getListingOwner: builder.query<User, string>({
        query: (userID: string) => (`/user/${userID}`)
      }),
      searchListing: builder.query<ListingResponse[], string>({
        query: (urlParams: string) => (`/listing/search/?${urlParams}`)
      })

    })
  }
)
export const {
  useGetListingDetailsQuery, useGetUserListingQuery, useGetListingOwnerQuery
,useSearchListingQuery} = ListingAPI

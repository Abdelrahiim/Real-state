import {ListingResponse} from "../api.ts";
import {Link} from "react-router-dom";
import {MdLocationOn} from "react-icons/md";

const ListingItem = ({listing}: { listing: ListingResponse }) => {
  return (
    <div
      className={"bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden w-full sm:w-[330px] "}>
      <Link to={`/listing/${listing._id}`}>
        <img src={listing.imageURL[0]} alt={listing.description}
             className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'/> {/*<div>{listing.name}</div>*/}
        <div className={"p-3 flex flex-col gap-2 w-full"}>
          <p className={"text-lg font-semibold text-slate-700 truncate"}>{listing.name}</p>
          <div className={"flex items-center gap-1"}>
            <MdLocationOn className={"w-4 h-4 text-green-700"}/>
            <p className={"text-sm text-gray-600"}>{listing.address}</p>
          </div>
          <p className={"text-sm text-gray-600 line-clamp-2"}>{listing.description}</p>
          <p className={"text-slate-500 mt-2 font-semibold"}>
            ${
            listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")
          }
            {listing.type === "rent" && " / month"}
          </p>
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div className='font-bold text-xs'>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
};

export default ListingItem

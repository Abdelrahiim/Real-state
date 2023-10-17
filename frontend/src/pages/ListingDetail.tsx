import {useParams} from "react-router-dom";

import {useGetListingDetailsQuery} from "../app/services/ListingAPI.ts";
import {Spinner} from "flowbite-react";
import SwiperCore from "swiper"
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from "swiper/modules";
import 'swiper/css/bundle';
import {FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking} from "react-icons/fa";
import {useSelector} from "react-redux";
import {RootState} from "../app/store.ts";
import {useState} from "react";
import Contact from "../components/Contact.tsx";
import {ListingResponse} from "../api.ts";


const ListingDetail = () => {
  SwiperCore.use([Navigation]);
  const {listingId} = useParams<{ listingId: string }>()
  const {data: listing, isFetching, error} = useGetListingDetailsQuery(listingId as string)
  const {currentUser} = useSelector((state: RootState) => state.user)
  const [contact,setContact] = useState(false)

  const closeContact = () =>{
    setContact(false)
  }

  if (isFetching) {
    return <div className={"flex items-center justify-center"}>
      <Spinner size={"lg"}/>
    </div>
  }


  return (
    <div>
      {error && <p className={"text-red-700"}>{
        // @ts-ignore
        error?.response?.data?.error || error.message
      }</p>}
      <div>
        <Swiper navigation>
          {listing?.imageURL.map((url) => (
            <SwiperSlide key={url}>
              <div
                className='h-[550px]'
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className='flex flex-col max-w-6xl mx-auto p-3 my-7 gap-4'>
        <p className='text-2xl font-semibold'>
          {listing?.name} - ${' '}
          {listing?.offer
            ? listing?.discountPrice.toLocaleString('en-US')
            : listing?.regularPrice.toLocaleString('en-US')}
          {listing?.type === 'rent' && ' / month'}
        </p>
        <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
          <FaMapMarkerAlt className='text-green-700'/>
          {listing?.address}
        </p>
        <div className='flex gap-4'>
          <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
            {listing?.type === 'rent' ? 'For Rent' : 'For Sale'}
          </p>
          {listing?.offer && (
            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
              ${listing.regularPrice - listing.discountPrice} OFF
            </p>
          )}
        </div>
        <p className={"text-slate-800"}>
        <span className={"font-semibold text-black"}>
          Description - {" "}
        </span>
          {listing?.description}
        </p>
        <ul className={"text-green-900 font-semibold flex items-center flex-wrap gap-4 sm:gap-6 md text-sm"}>
          <li className={"flex items-center gap-1 whitespace-nowrap "}>
            <FaBed className={"text-lg"}/>
            {listing && listing.bedrooms > 1 ? `${listing?.bedrooms} beds` : `${listing?.bedrooms} bed`}
          </li>
          <li className={"flex items-center gap-1 whitespace-nowrap "}>
            <FaBath className={"text-lg"}/>
            {listing && listing.bathrooms > 1 ? `${listing?.bathrooms} baths` : `${listing?.bathrooms} bath`}
          </li>
          <li className={"flex items-center gap-1 whitespace-nowrap "}>
            <FaParking className={"text-lg"}/>
            {listing?.parking ? `Parking` : `No Parking`}
          </li>
          <li className={"flex items-center gap-1 whitespace-nowrap "}>
            <FaChair className={"text-lg"}/>
            {listing?.furnished ? `Furnished` : `Not Furnished`}
          </li>
        </ul>
        {
          currentUser
          && currentUser._id !== listing?.userRef
          && !contact &&
            <button onClick={()=>{
              setContact(true)
            }} className={"bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 p-3 "}>Contact
                LandLord</button>
        }
        {
          contact && <Contact listing={listing as ListingResponse} closeContact={closeContact}/>
        }
      </div>
    </div>
  );
};


export default ListingDetail
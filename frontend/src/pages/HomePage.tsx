import {Link} from "react-router-dom";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import {useSearchListingQuery} from "../app/services/ListingAPI.ts";
import ListingItem from "../components/ListingItem.tsx";

const HomePage = () => {
  SwiperCore.use([Navigation]);
  const {data: offerListings} = useSearchListingQuery("offer=true&limit=4")
  const {data: rentListings} = useSearchListingQuery("type=rent&limit=4")
  const {data: saleListings} = useSearchListingQuery("type=sale&limit=4")

  return (
    <div>

      {/* Top */}
      <div className={"flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto"}>
        <h1 className={"text-slate-700 font-bold text-3xl md:text-6xl "}> Find your next <span
          className={"text-slate-500"}>Perfect</span> <br/> place with ease</h1>
        <div className={"text-gray-400 text-xs sm:text-sm"}>
          Infinity Estate is the best place to find your next perfect place to live
          <br/>
          We have a wide range of properties for you to choose from
        </div>
        <Link className={"text-xs sm:text-sm text-blue-800 font-bold hover:underline"} to={"/search"}>Lets Start
          Now</Link>
      </div>
      {/* Swiper */}
      <Swiper navigation>
        {offerListings && offerListings.length > 0 && offerListings.map((offerListing) => (
          <SwiperSlide key={offerListing._id}>
            <div style={{background: `url(${offerListing.imageURL[0]}) center no-repeat`, backgroundSize: "cover"}}
                 className={"h-[500px]"}>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* listing offer , sale , rent */}
      {/* Offer */}
      <div className={"max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10"}>
        {offerListings && offerListings.length > 0 &&
            <div>
                <div className={"my-3"}>
                    <h2 className={"text-2xl text-slate-600 font-semibold"}> Recent offers</h2>
                    <Link className={"text-sm text-blue-800 hover:underline"} to={"/search?offer=true"}>
                        Show more Offers
                    </Link>
                </div>
                <div className={"flex flex-wrap gap-4"}>
                  {offerListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id}/>
                  ))}
                </div>
            </div>
        }
      </div>
      {/* Rent */}
      <div className={"max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10"}>
        {rentListings && rentListings.length > 0 &&
            <div>
                <div className={"my-3"}>
                    <h2 className={"text-2xl text-slate-600 font-semibold"}> Recent offers</h2>
                    <Link className={"text-sm text-blue-800 hover:underline"} to={"/search?type=rent"}>
                        Show more Rent
                    </Link>
                </div>
                <div className={"flex flex-wrap gap-4"}>
                  {rentListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id}/>
                  ))}
                </div>
            </div>
        }
      </div>
      {/* Sale */}
      <div className={"max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10"}>
        {saleListings && saleListings.length > 0 &&
            <div>
                <div className={"my-3"}>
                    <h2 className={"text-2xl text-slate-600 font-semibold"}> Recent Sales</h2>
                    <Link className={"text-sm text-blue-800 hover:underline"} to={"/search?type=sale"}>
                        Show more Sales
                    </Link>
                </div>
                <div className={"flex flex-wrap gap-4"}>
                  {saleListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id}/>
                  ))}
                </div>
            </div>
        }
      </div>


    </div>

  );
};

export default HomePage
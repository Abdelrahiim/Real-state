import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {SearchForm} from "../api.ts";
import {isHTMLSelectElement} from "../utils.ts";
import {useNavigate} from "react-router-dom";
import {useSearchListingQuery} from "../app/services/ListingAPI.ts";
import {Spinner} from "flowbite-react";
import ListingItem from "../components/ListingItem.tsx";

const Search = () => {
  const [sidebarData, setSidebarData] = useState<SearchForm>({
    searchTerm: "",
    type: "all",
    sort:  'createdAt',
    order: "desc"
  })
  const [searchQuery, setSearchQuery] = useState<string>()

  const {data: listings, isLoading} = useSearchListingQuery(searchQuery as string)

  const navigate = useNavigate()
  // console.log(sidebarData)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
      });
      setSearchQuery(urlParams.toString())
    }

  }, [location.search]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (isHTMLSelectElement(e.target)) {
      const [sort, order] = e.target.value.split("_")
      setSidebarData({...sidebarData, sort, order})
    } else {
      if (e.target.id === "all" || e.target.id === "sale" || e.target.id === "rent") {
        setSidebarData({...sidebarData, type: e.target.id}
        )
      }
      if (e.target.id === "searchTerm") {
        setSidebarData({...sidebarData, searchTerm: e.target.value})
      }
      if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
        setSidebarData({
          ...sidebarData, [e.target.id]:
            e.target.checked ? true : undefined
        })
      }
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm)
    urlParams.set("type", sidebarData.type as string)
    if (sidebarData.parking) {
      urlParams.set("parking", String(sidebarData.parking))
    }
    if (sidebarData.offer) {
      urlParams.set("offer", String(sidebarData.offer))
    }
    if (sidebarData.furnished) {
      urlParams.set("furnished", String(sidebarData.furnished))
    }
    urlParams.set("sort", sidebarData.sort as string)
    urlParams.set("order", sidebarData.order as string)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)

  };
  return (
    <div className={"flex flex-col md:flex-row"}>
      <div className={"left-side p-7 border-b-2 md:border-r-2 md:min-h-screen"}>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className={"flex items-center gap-2 "}>
            <label className={"whitespace-nowrap "}>Search Term : </label>
            <input onChange={handleChange} value={sidebarData.searchTerm} type={"text"} id={"searchTerm"}
                   placeholder={"Search ..."}
                   className={"border rounded-lg p-3 w-full"}/>
          </div>

          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='all'
                className='w-5 h-5'
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5 h-5'
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5 h-5'
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5 h-5'
                onChange={handleChange}
                checked={sidebarData?.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2 items-center'>
              <input
                type='checkbox'
                id='parking'
                className='w-5 h-5 '
                onChange={handleChange}
                checked={sidebarData?.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5 h-5 '
                onChange={handleChange}
                checked={sidebarData?.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>

        </form>
      </div>
      <div className={"right-side flex-1 "}>
        {
          isLoading ?
            <div className={"flex items-center justify-center"}>
              <Spinner size={"lg"}/>
            </div>
            :
            <>
              <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
                Listing results:
              </h1>
              <div className='p-7 flex flex-wrap gap-4' >

              {listings?.length === 0 && (
                <p className={"text-xl text-slate-700 p-7  "}>
                  No Listing Found
                </p>
              )}
              {listings && listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing}/>
              ))}
              </div>


            </>
        }
      </div>


    </div>
  );
};
export default Search
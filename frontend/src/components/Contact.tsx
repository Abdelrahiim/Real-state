import {Link} from "react-router-dom";
import {ListingResponse} from "../api.ts";
import {useGetListingOwnerQuery} from "../app/services/ListingAPI.ts";
import {Spinner} from "flowbite-react";
import {ChangeEvent, useState} from "react";
import {IoCloseSharp} from "react-icons/io5";


// @ts-ignore
const Contact = ({listing ,closeContact}: { listing: ListingResponse,closeContact:()=>void }) => {
  const {data: landLord, isLoading} = useGetListingOwnerQuery(listing.userRef)
  const [message, setMessage] = useState("")

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  if (isLoading) {
    return <div className={"flex items-center justify-center"}>
      <Spinner size={"lg"}/>
    </div>
  }

  // @ts-ignore
  return (
    <div className={"flex flex-col gap-4"}>
      <div className={"flex justify-between items-center mx-4"}>

      <p>Contact
        <span className={"font-semibold"}>{" "} {landLord?.username}{" "}</span>
        for
        <span className={"font-semibold"}>{" "} {listing.name.toLowerCase()} {" "}</span>
      </p>
        <IoCloseSharp onClick={closeContact} className ={"font-sm cursor-pointer text-slate-700"}/>

      </div>
      <textarea onChange={handleChange} value={message} placeholder={"Enter You Message Here"}
                className={"w-full border p-3 rounded-lg "} name={"message"} id={"message"} rows={2}></textarea>
      <Link to={`mailto:${landLord?.email}?subject=Regarding${listing.name}&body=${message}`}
            className={"bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"}>
        Send Message
      </Link>

    </div>

  );
};

export default Contact
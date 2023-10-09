import { FileInput} from "flowbite-react";

const CreateListing = () => {
  return (
    <div className={"p-3 max-w-4xl mx-auto"}>
      <h1 className={"text-3xl font-semibold text-center my-7"}>Create A Listing</h1>
      <form className={"flex flex-col gap-4 sm:flex-row"}>
        <div className={"flex flex-col flex-1  full gap-4"}>
          <input id={"name"} type={"text"} placeholder={"name"} className={"border p-3 rounded-lg"} maxLength={62}
                 minLength={10} required/>
          <textarea id={"description"} placeholder={"Description"} className={"border p-3 rounded-lg"}
                    required></textarea>
          <input id={"address"} type={"text"} placeholder={"Address"} className={"border p-3 rounded-lg"} required/>

          <div className={"flex flex-wrap  gap-12"}>
            <div className={"flex gap-2 items-center"}>
              <input type={"checkbox"} id={"sale"} className={"w-5 h-5"}/>
              <span>Sell</span>
            </div>
            <div className={"flex gap-2 items-center"}>
              <input type={"checkbox"} id={"rent"} className={"w-5 h-5"}/>
              <span>Rent</span>
            </div>
            <div className={"flex gap-2 items-center"}>
              <input type={"checkbox"} id={"parking"} className={"w-5 h-5"}/>
              <span>Parking</span>
            </div>
            <div className={"flex gap-2 items-center"}>
              <input type={"checkbox"} id={"furnished"} className={"w-5 h-5"}/>
              <span>Furnished</span>
            </div>
            <div className={"flex gap-2 items-center"}>
              <input type={"checkbox"} id={"offer"} className={"w-5 h-5"}/>
              <span>offer</span>
            </div>
          </div>
          <div className={" flex items-center gap-8 flex-wrap"}>
            <div className={"flex items-center gap-2"}>
              <input type={"number"} id={"bedrooms"} min={1} max={10} required
                     className={"p-3 border border-gray-300 rounded-lg"}/>
              <p>Beds</p>
            </div>
            <div className={"flex items-center gap-2"}>
              <input type={"number"} id={"bathrooms"} min={1} max={10} required
                     className={"p-3 border border-gray-300 rounded-lg"}/>
              <p>Baths</p>
            </div>
            <div className={"flex items-center gap-2"}>
              <input type={"number"} id={"regularPrice"} required
                     className={"p-3 border border-gray-300 rounded-lg"}/>
              <div className={"flex flex-col items-center"}>
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>

            </div>
            <div className={"flex items-center gap-2"}>
              <input type={"number"} id={"discountPrice"} min={10000} required
                     className={"p-3 border border-gray-300 rounded-lg"}/>
              <div className={"flex flex-col items-center"}>
                <p>Discounted Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className={"flex flex-col flex-1"}>
          <div className={"flex ml-4"}>
            <p className={"font-semibold"}>Images</p>
            <span className={"font-normal text-gray-600 ml-2"}> The First image will be The Cover (max 6) </span>
          </div>

          <div className={"flex gap-4 my-4"}>
            <FileInput
              id="images"
              accept={"images"}
              multiple
            />
            <button
              className={"px-6 py-2 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"}>Upload
            </button>
          </div>
          <button className={"p-3 mt-8 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"}>Create Listing</button>
        </div>


      </form>
    </div>
  );
};

export default CreateListing

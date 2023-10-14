import {FileInput} from "flowbite-react";
import {ChangeEvent, FormEvent, useState} from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import {app} from "../firebase.ts";
import {generateUniqueFileName} from "../utils.ts";
import {createListingApi, Listing} from "../api.ts";
import {AxiosError} from "axios";
import {Status} from "../features/user/userSlice.ts";
import {useNavigate} from "react-router-dom";


const CreateListing = () => {
  const [images, setImages] = useState<File []>([])

  const [formData, setFormData] = useState<Listing>({
    address: "",
    bathrooms: 1,
    bedrooms: 1,
    description: "",
    discountPrice: 0,
    furnished: false,
    imageURL: [],
    name: "",
    offer: false,
    parking: false,
    regularPrice: 100,
    type: "rent"
  })

  const [errorUploadImages, setErrorUploadImages] = useState<string | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>(Status.Idle)
  const navigate = useNavigate()
  const handleImageSubmit = async () => {
    if (images?.length > 0 && images?.length + formData.imageURL.length < 7) {
      setUploading(true)
      setErrorUploadImages(null)
      const promises = [];
      for (let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[0]))
      }
      try {
        const urls = await Promise.all(promises)
        setFormData({...formData, imageURL: formData.imageURL.concat(urls)})
        setErrorUploadImages(null)
        setUploading(false)
      } catch (e) {
        setErrorUploadImages("Image upload Failed (2 mb max per image)")
        setUploading(false)
      }
    } else {
      setErrorUploadImages(" You Can Only Upload 6 images per Listing ")
      setUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData({
        ...formData,
        imageURL: formData.imageURL.filter((_, i) => i !== index)
      }
    )
  }
  const storeImage = async (image: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = generateUniqueFileName(image.name)
      const storageRef = ref(storage, `/listing/${fileName}`)
      const uploadTask = uploadBytesResumable(storageRef, image)
      uploadTask.on(
        "state_changed",
        (_snapshot) => {
        },
        (error) => {
          reject(error)
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL)

        }
      )
    })

  }

  function isHTMLTextAreaElement(element: any): element is HTMLTextAreaElement {
    return element instanceof HTMLTextAreaElement;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isHTMLTextAreaElement(e.target)) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })

    } else {
      if (e.target.id === "sale" || e.target.id === "rent") {
        setFormData({
          ...formData,
          type: e.target.id
        })
      } else if (e.target.id === 'parking' || e.target.id === "furnished" || e.target.id === "offer") {
        setFormData({
          ...formData,
          [e.target.id]: e.target.checked
        })
      } else if (e.target.type === "number" || e.target.type === "text") {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value
        })
      }
    }
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (formData.imageURL.length < 1) {
        setError("You Must Upload at Least One Image")
        return
      }
      if (formData.regularPrice < formData.discountPrice) {
        setError("Discount Price Must be Less Than Regular Price")
        return
      }
      setStatus(Status.Submitting)
      setError(null)
      // @ts-ignore
      const response = await createListingApi(formData)
      setStatus(Status.Idle)
      navigate(`${response.data._id}`, {
        replace: true,
      });

    } catch (err) {
      const e = err as AxiosError<{ error: string }>
      setError(e?.response?.data?.error || e.message)
      setStatus(Status.Idle)
    }

  }
  return (
    <div className={"p-3 max-w-4xl mx-auto"}>
      <h1 className={"text-3xl font-semibold text-center my-7"}>Create A Listing</h1>
      <form onSubmit={handleSubmit} className={"flex flex-col gap-4 sm:flex-row"}>
        <div className={"flex flex-col flex-1  full gap-4"}>
          <input value={formData.name} onChange={handleChange} id={"name"} type={"text"} placeholder={"name"}
                 className={"border p-3 rounded-lg"} maxLength={62}
                 minLength={10} required/>
          <textarea onChange={handleChange} value={formData.description} id={"description"} placeholder={"Description"}
                    className={"border p-3 rounded-lg"}
                    required></textarea>
          <input onChange={handleChange} value={formData.address} id={"address"} type={"text"} placeholder={"Address"}
                 className={"border p-3 rounded-lg"} required/>

          <div className={"flex flex-wrap  gap-12"}>
            <div className={"flex gap-2 items-center"}>
              <input onChange={handleChange} checked={formData.type === "sale"} type={"checkbox"} id={"sale"}
                     className={"w-5 h-5"}/>
              <span>Sell</span>
            </div>
            <div className={"flex gap-2 items-center"}>
              <input type={"checkbox"} onChange={handleChange} checked={formData.type === "rent"} id={"rent"}
                     className={"w-5 h-5"}/>
              <span>Rent</span>
            </div>
            <div className={"flex gap-2 items-center"}>
              <input onChange={handleChange} checked={formData.parking} type={"checkbox"} id={"parking"}
                     className={"w-5 h-5"}/>
              <span>Parking</span>
            </div>
            <div className={"flex gap-2 items-center"}>
              <input onChange={handleChange} checked={formData.furnished} type={"checkbox"} id={"furnished"}
                     className={"w-5 h-5"}/>
              <span>Furnished</span>
            </div>
            <div className={"flex gap-2 items-center"}>
              <input onChange={handleChange} checked={formData.offer} type={"checkbox"} id={"offer"}
                     className={"w-5 h-5"}/>
              <span>offer</span>
            </div>
          </div>
          <div className={" flex items-center gap-8 flex-wrap"}>
            <div className={"flex items-center gap-2"}>
              <input onChange={handleChange} value={formData.bedrooms} type={"number"} id={"bedrooms"} min={1} max={10}
                     required
                     className={"p-3 border border-gray-300 rounded-lg"}/>
              <p>Beds</p>
            </div>
            <div className={"flex items-center gap-2"}>
              <input onChange={handleChange} value={formData.bathrooms} type={"number"} id={"bathrooms"} min={1}
                     max={10} required
                     className={"p-3 border border-gray-300 rounded-lg"}/>
              <p>Baths</p>
            </div>
            <div className={"flex items-center gap-2"}>
              <input onChange={handleChange} type={"number"} min={100} value={formData.regularPrice} id={"regularPrice"}
                     required
                     className={"p-3 border border-gray-300 rounded-lg"}/>
              <div className={"flex flex-col items-center"}>
                <p>Regular Price</p>
                {formData.type === "rent" &&
                    <span className="text-xs">($ / month)</span>}
              </div>
            </div>
            {formData.offer &&
                <div className={"flex items-center gap-2"}>
                    <input onChange={handleChange} type={"number"} value={formData.discountPrice} id={"discountPrice"}
                           min={0} required
                           className={"p-3 border border-gray-300 rounded-lg"}/>
                    <div className={"flex flex-col items-center"}>
                        <p>Discounted Price</p>
                      {formData.type === "rent" &&
                          <span className="text-xs">($ / month)</span>}
                    </div>
                </div>
            }
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
              accept={"images/*"}
              multiple
              onChange={(e) => setImages(e?.target?.files as unknown as File[])}
            />
            <button type={"button"} onClick={handleImageSubmit} disabled={uploading}
                    className={"px-6 py-2 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"}>
              {!uploading ? "Upload" :
                <>
                  <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin"
                       viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"/>
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"/>
                  </svg>
                  Loading..
                </>}
            </button>
          </div>
          {errorUploadImages && <p className={"text-red-700"}>{errorUploadImages}</p>}
          {formData.imageURL.length > 0 && formData.imageURL.map((url, index) =>
            <div key={index} className={"flex justify-between p-3 border items-center"}>
              <img src={url} alt={"listing image"} className={"w-40 h-40 object-cover rounded-lg"}/>
              <button type={"button"} onClick={() => {
                handleRemoveImage(index)
              }} className={"p-3 text-red-700 rounded hover:opacity-95"}>Delete
              </button>
            </div>
          )
          }
          <button
            className={"p-3 mt-8 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"}
            disabled={status === Status.Submitting || uploading}>
            {status !== Status.Submitting ? "Create Listing" : <>
              <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin"
                   viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"/>
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"/>
              </svg>
              Loading..</>}
          </button>
          {error && <p className='text-red-700 mt-5'>{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default CreateListing

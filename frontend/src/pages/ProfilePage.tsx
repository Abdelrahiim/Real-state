import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../app/store.ts";
import {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import SignOut from "../components/SignOut.tsx";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import {app} from "../firebase.ts";
import {generateUniqueFileName} from "../utils.ts";
import {deleteListing, getListing, ListingResponse, UpdateFormData, updateProfile} from "../api.ts";
import {updateStart, updateFailure, updateSuccess, Status} from "../features/user/userSlice.ts";
import {AxiosError} from "axios";
import DeleteUser from "../components/DeleteUser.tsx";
import {Link} from "react-router-dom";
import {Spinner} from "flowbite-react";


const ProfilePage = () => {
  const [file, setFile] = useState<File | null>()
  const fileRef = useRef<HTMLInputElement>(null)
  const [imagePercentage, setImagePercentage] = useState(0)
  const [imageUploadError, setImageUploadError] = useState(false);
  const {currentUser, status, error} = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const [update, setUpdate] = useState(false)
  const [formData, setFormData] = useState<UpdateFormData>({});
  const [showListingError, setShowListingError] = useState<null | string>(null)
  const [userListings, setUserListings] = useState<ListingResponse[]>([])
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      dispatch(updateStart())
      const response = await updateProfile(currentUser?._id as string, formData)

      dispatch(updateSuccess(response.data))
      setUpdate(true)
    } catch (err) {
      const e = err as AxiosError<{ error: string }>
      dispatch(updateFailure(e?.response?.data.error as string));
    }
  }

  const handleFileUpload = (file: File) => {
    const storage = getStorage(app);
    const fileName = generateUniqueFileName(file.name)
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on("state_changed", (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImagePercentage(Math.round(progress))
      }, (_error) => {
        setImageUploadError(true)
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        setFormData({...formData, avatar: downloadURL})
      }
    )
  }

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleShowListings = async () => {
    try {
      setShowListingError(null)
      const response = await getListing();
      console.log(response.data)
      setUserListings(response.data)

    } catch (err) {
      const e = err as AxiosError<{ error: string }>
      setShowListingError(e?.response?.data.error || e.message)
    }
  }

  const handleListingDelete = async (id: string) => {
    try {
      // @ts-ignore
      const  _response = await deleteListing(id)
      setUserListings((prev) => prev.filter((listing) => listing._id !== id))
    } catch (err) {
      console.log(err)

    }
  }
  return <div className={"p-3 max-w-xl mx-auto"}>
    <h1 className={"text-3xl font-semibold text-center my-7"}>
      Profile Page
    </h1>
    <form onSubmit={handleSubmit} className={"flex flex-col space-y-4"}>
      <input type={"file"} onChange={(e) => {
        if (e.target.files) {
          setFile(e?.target?.files[0]);
        }
      }} hidden accept={"image/*"} ref={fileRef}/>
      <img onClick={() => fileRef.current?.click()}
           className={"rounded-full self-center mt-2 h-24 w-24 object-cover cursor-pointer"}
           src={formData.avatar || currentUser?.avatar}
           alt={currentUser?.username}/>

      <p className='text-sm self-center'>
        {imageUploadError ? (
          <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
        ) : imagePercentage > 0 && imagePercentage < 100 ? (
          <span className='text-slate-700'>{`Uploading ${imagePercentage}%`}</span>
        ) : imagePercentage === 100 ? (
          <span className='text-green-700'>Image successfully uploaded!</span>
        ) : (
          ''
        )}

      </p>

      <input type={"text"} onChange={handleChange} defaultValue={currentUser?.username} placeholder={"UserName"}
             className={"border p-3 rounded-lg"} id={"username"}/>
      <input type={"email"} onChange={handleChange} defaultValue={currentUser?.email} placeholder={"Email"}
             className={"border p-3 rounded-lg"} id={"email"}/>
      <input type={"password"} onChange={handleChange} placeholder={"password"} className={"border p-3 rounded-lg"}
             id={"password"}/>
      <button className={"bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-500"}
              disabled={status === Status.Submitting}>
        {status !== Status.Submitting ? "Update" : <>
          <Spinner/>
          Loading..</>}
      </button>
      <Link to={"/listing"}
            className={"bg-green-700 text-white p-3 text-center rounded-lg uppercase hover:bg-green-500"}> Create
        Listing </Link>
    </form>

    <div className={"flex justify-between mt-5"}>
      <DeleteUser/>
      <SignOut/>
    </div>
    {error && <p className={"text-red-700"}>{error}</p>}
    {update && <p className={"text-green-700"}>User Update Successfully</p>}
    <button onClick={handleShowListings} className={"text-green-700 w-full"}>Show Listings</button>
    {showListingError && <p className={"text-red-700 mt-5"}>{showListingError}</p>}
    {userListings && userListings.length > 0 &&
        <div className={"flex flex-col gap-4"}>
            <h1 className={"text-center mt-7 text-2xl font-semibold"}>You Listings</h1>
          {userListings.map((userListing) => (
            <div key={userListing._id} className={"flex my-4 justify-between p-3 items-center border rounded-lg gap-4"}>
              <Link to={`/listing/${userListing._id}`}>
                <img src={userListing.imageURL[0]} alt={"listing image"} className={"h-16 w-16 object-contain "}/>
              </Link>
              <Link className={"text-stale-700 font-semibold flex-1 hover:underline truncate"}
                    to={`/listing/${userListing._id}`}>
                <p>{userListing.name}</p>
              </Link>
              <div className={"flex flex-col items-center"}>
                <button onClick={() => handleListingDelete(userListing._id)}
                        className={"text-red-700 uppercase"}>Delete
                </button>
                <button className={"text-green-700 uppercase"}>Edit</button>
              </div>
            </div>
          ))
          }
        </div>

    }
  </div>;
};

export default ProfilePage

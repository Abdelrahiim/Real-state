import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../app/store.ts";
import {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import SignOut from "../components/SignOut.tsx";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import {app} from "../firebase.ts";
import {generateUniqueFileName} from "../utils.ts";
import {UpdateFormData, updateProfile} from "../api.ts";
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  console.log(formData)
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
          <Spinner />
          Loading..</>}
      </button>
      <Link to={"/create-listing"}
            className={"bg-green-700 text-white p-3 text-center rounded-lg uppercase hover:bg-green-500"}> Create Listing </Link>
    </form>

    <div className={"flex justify-between mt-5"}>
      <DeleteUser/>
      <SignOut/>
    </div>
    {error && <p className={"text-red-700"}>{error}</p>}
    {update && <p className={"text-green-700"}>User Update Successfully</p>}
  </div>;
};

export default ProfilePage

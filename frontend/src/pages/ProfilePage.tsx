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


const ProfilePage = () => {
  const [file, setFile] = useState<File | null>()
  const fileRef = useRef<HTMLInputElement>(null)
  const [imagePercentage, setImagePercentage] = useState(0)
  const [imageUploadError, setImageUploadError] = useState(false);
  const {currentUser, status,error} = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const [update,setUpdate] = useState(false)
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
    </form>
    <div className={"flex justify-between mt-5"}>
      <DeleteUser />
      <SignOut/>
    </div>
     {error && <p className={"text-red-700"}>{error}</p>}
     {update && <p className={"text-green-700"}>User Update Successfully</p>}
  </div>;
};

export default ProfilePage

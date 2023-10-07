import {useSelector} from "react-redux";
import {RootState} from "../app/store.ts";
import {useEffect, useRef, useState} from "react";
import SignOut from "../components/SignOut.tsx";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import {app} from "../firebase.ts";
import {generateUniqueFileName} from "../utils.ts";

interface FormData {
  avatar: string,
  username: string,
  email: string,
  password: string
}

const ProfilePage = () => {
  const [file, setFile] = useState<File | null>()
  const fileRef = useRef<HTMLInputElement>(null)
  const [imagePercentage, setImagePercentage] = useState(0)
  const [imageUploadError, setImageUploadError] = useState(false);
  const {currentUser} = useSelector((state: RootState) => state.user)
  const [formData, setFormData] = useState<FormData>({avatar: "", email: "", password: "", username: ""});
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
    <form className={"flex flex-col space-y-4"}>
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

      <input type={"text"} placeholder={"UserName"} className={"border p-3 rounded-lg"} id={"username"}/>
      <input type={"email"} placeholder={"Email"} className={"border p-3 rounded-lg"} id={"email"}/>
      <input type={"password"} placeholder={"password"} className={"border p-3 rounded-lg"} id={"password"}/>
      <button className={"bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95"}>Update</button>
    </form>
    <div className={"flex justify-between mt-5"}>
      <span className={"text-red-700 cursor-pointer"}>Delete Account</span>
      <SignOut/>
    </div>
  </div>;
};

export default ProfilePage

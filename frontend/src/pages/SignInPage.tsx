import {Link, useNavigate} from "react-router-dom";
import {SignInData, signInUser,} from "../api.ts";
import {ChangeEvent, FormEvent, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AxiosError} from "axios";
import {signInStart, signInFailure, signInSuccess, Status} from "../app/features/user/userSlice.ts";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import {RootState} from "../app/store.ts";
import Oauth from "../components/Oauth.tsx";

// export const action = async ({request}: ActionFunctionArgs) => {
//   // const signIn = useSignIn()
//   const formDate = await request.formData();
//   const user: SignInData = {
//     password: formDate.get("password") as string,
//     username: formDate.get("username") as string
//   }
//   try {
//     const {token}: {
//       token: string
//     } = await signInUser(user)
//     console.log(token)
//     // signIn({expiresIn:30 , token:token, tokenType: "Bearer"})
//     return redirect("/")
//   } catch (e) {
//     return e
//   }
// }


const SignInPage = () => {

  const [formData, setFormData] = useState<SignInData>({password: "", email: ""});
  const {status, error} = useSelector((state: RootState) => state.user)
  const signIn = useSignIn()
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(signInStart())
      const response = await signInUser(formData)
      signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: {email: formData.email},
      })
      dispatch(signInSuccess(response.data.user))
      navigate("/", {
        replace: true,
      });
    } catch (err) {
      const e = err as AxiosError<{ error: string }>
      dispatch(signInFailure(e?.response?.data.error || e.message));
    }
  };
  return (
    <div className='p-3 mt-40 max-w-xl mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />

        <button className={"bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-500"}
                disabled={status === Status.Submitting}>
          {status !== Status.Submitting ? "Sign Up" : <>
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
        <Oauth/>

      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
};

export default SignInPage

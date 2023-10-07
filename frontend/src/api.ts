import axios, {AxiosError, AxiosResponse} from "axios";

const baseUrl = "api"

export interface LoginData {
  username: string
  email: string;
  password: string;
}

export interface SignInData {
  email: string
  password: string;
}

export interface SignInWithGoogleData{
  displayName:string
  email:string
  photoURL:string

}
export interface User {
  _id: string,
  username: string,
  email: string
}

interface SignInResponse {
  token: string,
  user: User
}


export const signupUser = async (credentials: LoginData) => {
  try {
    return await axios.post(`${baseUrl}/user/auth/sign-up`, credentials) as AxiosResponse<SignInResponse>
  } catch (err) {
    throw err as AxiosError
  }
}

export const signInUser = async (credentials: SignInData) => {
  try {
    return await axios.post(`${baseUrl}/user/auth/sign-in`, credentials) as AxiosResponse<SignInResponse>
  } catch (err) {
    console.log(err)
    throw err as AxiosError
  }
}
export const signInGoogle = async (credentials: SignInWithGoogleData) => {
  const data= {
    username : credentials.displayName ,
    email:credentials.email,
    photoURL:credentials.photoURL

  }
  try {
    return await axios.post(`${baseUrl}/user/auth/google`, data) as AxiosResponse<SignInResponse>
  } catch (err) {
    console.log(err)
    throw err as AxiosError
  }
}


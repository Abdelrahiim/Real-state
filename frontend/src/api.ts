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

export interface SignInWithGoogleData {
  displayName: string
  email: string
  photoURL: string

}

export interface User {
  _id: string,
  username: string,
  email: string,
  avatar: string
}

export interface UpdateFormData {
  avatar?: string,
  username?: string,
  email?: string,
  password?: string
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
  const data = {
    username: credentials.displayName,
    email: credentials.email,
    photoURL: credentials.photoURL
  }
  try {
    return await axios.post(`${baseUrl}/user/auth/google`, data) as AxiosResponse<SignInResponse>
  } catch (err) {
    console.log(err)
    throw err as AxiosError
  }
}


export const updateProfile = async (id: string, formData: UpdateFormData) => {

  try {
    return await axios.put(`${baseUrl}/user/update/${id}`, formData) as AxiosResponse<User>
  } catch (err) {
    console.log(err)
    throw err as AxiosError
  }
}

export const deleteProfile = async (id: string) => {
  try {
    return await axios.delete(`${baseUrl}/user/delete/${id}`)
  } catch (err) {
    console.log(err)
    throw err as AxiosError
  }

}
import axios, {AxiosError, AxiosResponse} from "axios";

const baseUrl = "api"

export interface LoginData {
  username: string
  email: string;
  password: string;
}

export interface SignInData {
  username: string
  password: string;

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
    const response = await axios.post(`${baseUrl}/user/auth/sign-up`, credentials)
    console.log(response.status)
    return response.status
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
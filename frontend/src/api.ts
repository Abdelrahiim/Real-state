import axios, {AxiosError} from "axios";

const baseUrl = "http://localhost:5000/api"

export interface LoginData {
  username: string
  email: string;
  password: string;
}


export const signupUser = async (credentials: LoginData) => {
  try {
    const response = await axios.post(`${baseUrl}/user/auth/sign-up`, credentials)
    console.log(response.status)
    return response.status
  } catch (err) {

    console.log(err)
    throw err as AxiosError

  }

}
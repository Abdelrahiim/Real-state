import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {User} from "../../api.ts";
export enum Status {
  Idle = "idle",
  Submitting = "submitting",
  Loading = "loading"
}

interface UserState {
  currentUser?: User ,
  error ?: string ,
  status:Status
}

const initialState:UserState = {
  currentUser:undefined,
  error:undefined,
  status: Status.Idle
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.status = Status.Submitting
    },
    signInSuccess: (state, action:PayloadAction<User>) => {
      state.currentUser = action.payload
      state.status = Status.Idle
      state.error = undefined
    },
    signInFailure: (state, action:PayloadAction<string>) => {
      state.error = action.payload
      state.status = Status.Idle
    },
    signingOut:(state)=>{
      state.currentUser = undefined
    }

  }
})

export const {signInStart,signInSuccess,signInFailure , signingOut} = userSlice.actions
export default userSlice.reducer;
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Status} from "../../pages/SignUpPage.tsx";
import {User} from "../../api.ts";

interface UserState {
  currentUser?: User ,
  error ?: string ,
  status:Status
}

const initialState:UserState = {
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
    }

  }
})

export const {signInStart,signInSuccess,signInFailure} = userSlice.actions
export default userSlice.reducer;
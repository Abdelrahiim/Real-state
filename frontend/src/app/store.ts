import {combineReducers, configureStore} from '@reduxjs/toolkit'
import userReducer from "./features/user/userSlice.ts"
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {ListingAPI} from "./services/ListingAPI.ts";


const rootReducer = combineReducers({
  user: userReducer,
  ListingAPI:ListingAPI.reducer,
})


const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ['user']
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const userStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false}).concat(ListingAPI.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the userStore itself
export type RootState = ReturnType<typeof userStore.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof userStore.dispatch

export const persistor = persistStore(userStore)
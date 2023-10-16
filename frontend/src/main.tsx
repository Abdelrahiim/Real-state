import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from "react-redux";
import App from './App.tsx'
import './index.css'
import {PersistGate} from 'redux-persist/integration/react'
import {persistor, userStore} from "./app/store.ts";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={userStore}>
      <PersistGate loading={null} persistor={persistor}>
        <App/>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)

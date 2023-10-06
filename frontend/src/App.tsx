import {createBrowserRouter, RouterProvider} from "react-router-dom"

import Layout from "./components/Layout.tsx";
import {AboutPage, HomePage, ProfilePage, SignInPage, SignUpPage} from "./pages";
import {action as SignUpAction} from "./pages/SignUpPage.tsx";
import AuthProvider from "react-auth-kit/AuthProvider";
// import {action as SignInAction} from "./pages/SignInPage.tsx";


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        index: true,
        element: <HomePage/>
      },
      {
        path: "/about",
        element: <AboutPage/>
      },
      {
        path: "profile",
        element: <ProfilePage/>
      },
      {
        path: "sign-in",
        element: <SignInPage/>,
      },
      {
        path: "sign-up",
        element: <SignUpPage/>,
        action: SignUpAction
      }
    ]
  }
])


function App() {
  return (
    <AuthProvider authType={'cookie'}
                  authName={'access_token'}
                  cookieDomain={window.location.hostname}
                  cookieSecure={false}>
      <RouterProvider router={router}/>
    </AuthProvider>


  )
}

export default App

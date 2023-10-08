import {createBrowserRouter, RouterProvider} from "react-router-dom"

import Layout from "./components/Layout.tsx";
import {AboutPage, HomePage, ProfilePage, SignInPage, SignUpPage} from "./pages";
import AuthProvider from "react-auth-kit/AuthProvider";
import RequireAuth from "react-auth-kit/PrivateRoute";


// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore

const AboutPageProtected = <RequireAuth loginPath={"/sign-in"}> <AboutPage/> </RequireAuth>
// @ts-ignore
const ProfilePageProtected = <RequireAuth loginPath={"/sign-in"}><ProfilePage/> </RequireAuth>

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        index: true,
        element: <RequireAuth loginPath={"/sign-in"}><HomePage/></RequireAuth>
      },
      {
        path: "about",
        element: AboutPageProtected
      },
      {
        path: "profile",
        element: ProfilePageProtected
      },
      {
        path: "sign-in",
        element: <SignInPage/>,
      },
      {
        path: "sign-up",
        element: <SignUpPage/>,

      }
    ]
  }
])



function App() {
  return (
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain={window.location.hostname}
      cookieSecure={false}
    >
      <RouterProvider router={router}/>
    </AuthProvider>


  )
}

export default App

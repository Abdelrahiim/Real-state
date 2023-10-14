import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Layout from "./components/Layout.tsx";
import {AboutPage, HomePage, ProfilePage, SignInPage, SignUpPage, CreateListing, ListingDetail} from "./pages";
import AuthProvider from "react-auth-kit/AuthProvider";
import RequireAuth from "react-auth-kit/PrivateRoute";


// @ts-ignore
const router = createBrowserRouter([
  {
    path: '/',
    // @ts-ignore
    element: <RequireAuth loginPath={"/sign-in"}><Layout/> </RequireAuth>,
    children: [
      {
        index: true,
        element: <HomePage/>,
      },
      {
        path: "about",
        element: <AboutPage/>
      },
      {
        path: "profile",
        element: <ProfilePage/>
      },
      {
        path: "listing",
        children: [
          {
            index: true,
            element: <CreateListing/>,
          },
          {
            path: ":id",
            element: <ListingDetail/>
          }
        ]
      },
    ]
  },
  {
    path: "sign-in",
    element: <SignInPage/>,
  },
  {
    path: "sign-up",
    element: <SignUpPage/>,
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

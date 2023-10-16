import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Layout from "./components/Layout.tsx";
import {
  AboutPage,
  HomePage,
  ProfilePage,
  SignInPage,
  SignUpPage,
  CreateListing,
  ListingDetail,
  UpdateListing
} from "./pages";
import AuthProvider from "react-auth-kit/AuthProvider";
import RequireAuth from "react-auth-kit/PrivateRoute";



// @ts-ignore
const router = createBrowserRouter([
  {
    path: '/',
    // @ts-ignore
    element: <Layout/>,
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
        element: <RequireAuth loginPath={"/sign-in"}><ProfilePage/></RequireAuth>
      },
      {
        path: "listing",
        children: [
          {
            index: true,
            // @ts-ignore
            element: <RequireAuth loginPath={"/sign-in"}><CreateListing/> </RequireAuth>
          },
          {
            path: ":listingId",
            element: <ListingDetail/>
          },
          {
            path: ":listingId/edit",
            // @ts-ignore
            element: <RequireAuth loginPath={"/sign-in"}> <UpdateListing/> </RequireAuth>
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

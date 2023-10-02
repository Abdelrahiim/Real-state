import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Layout from "./components/Layout.tsx";
import {AboutPage, HomePage, ProfilePage, SignInPage, SignUpPage} from "./pages";


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
				element: <SignInPage/>
			},
			{
				path: "sign-up",
				element: <SignUpPage/>
			}
		]
	}
])

function App() {
	return (
		<RouterProvider router={router}/>
	)
}

export default App

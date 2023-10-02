import {Outlet} from "react-router-dom"
import Header from "./Header.tsx";

const Layout = () => {


	return (
		<>
			{/*NavBar*/}
			<Header />
			<main>
				<Outlet />
			</main>

		</>
	);
};
export default Layout
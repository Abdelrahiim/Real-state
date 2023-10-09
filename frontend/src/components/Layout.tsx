import {Outlet} from "react-router-dom"
import Header from "./Header.tsx";

const Layout = ():JSX.Element => {
	return (
		<div>
			{/*NavBar*/}
			<Header />
			<main>
				<Outlet />
			</main>

		</div>
	);
};
export default Layout
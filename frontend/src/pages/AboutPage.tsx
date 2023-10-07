import {useSelector} from "react-redux";
import {RootState} from "../app/store.ts";

const AboutPage = () => {
	const {currentUser} = useSelector((state:RootState) => state.user)
	return (
		<h1 className={"text-3xl"}>
			{currentUser?.email }
		</h1>
	);
};
export default AboutPage

import {useSelector} from "react-redux";
import {RootState} from "../app/store.ts";

const HomePage = () => {
	const {currentUser} = useSelector((state:RootState) => state.user)
	return (
		<h1 className={"text-3xl"}>
			{currentUser?.username}
		</h1>
	);
};

export default HomePage
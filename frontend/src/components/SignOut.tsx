import useSignOut from "react-auth-kit/hooks/useSignOut";
import {useDispatch} from "react-redux";
import {signingOut} from "../app/features/user/userSlice.ts";

const SignOut = () => {
  const signOut = useSignOut()
  const dispatch = useDispatch()
  const handleSignOut = () => {
    try {
      signOut()
      dispatch(signingOut())

    }catch (e){
      console.log(e)
    }

  }
  return (
    <span onClick={handleSignOut} className={"text-red-700 cursor-pointer"}>Sign Out</span>
  );
};
export default SignOut
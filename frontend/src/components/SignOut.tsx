import useSignOut from "react-auth-kit/hooks/useSignOut";
import {useDispatch} from "react-redux";
import {signingOut} from "../features/user/userSlice.ts";

const SignOut = () => {
  const signOut = useSignOut()
  const dispatch = useDispatch()
  const handleSignOut = () => {
    signOut()
    dispatch(signingOut())

  }
  return (
    <span onClick={handleSignOut} className={"text-red-700 cursor-pointer"}>Sign Out</span>
  );
};
export default SignOut
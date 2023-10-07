import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth"
import {app} from "../firebase.ts";
import {signInGoogle} from "../api.ts";
import {signInSuccess} from "../features/user/userSlice.ts";
import {useDispatch} from "react-redux";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import {useNavigate} from "react-router-dom";
const Oauth = () => {
  const dispatch = useDispatch()
  const signIn = useSignIn()
  const navigate= useNavigate()
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)
      const result = await signInWithPopup(auth, provider)
      const response = await signInGoogle({
        displayName: result.user.displayName as string,
        email: result.user.email as string,
        photoURL: result.user.photoURL as string
      })

      signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { email: response.data.user.email },
      })
      dispatch(signInSuccess(response.data.user))
      navigate("/", {
        replace: true,
      });
    } catch (e) {
      console.log("could no Sign i n with google ", e)
    }
  }
  return (
    <button onClick={handleGoogleClick} type={"button"}
            className={"bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"}>Continue With Google</button>
  );
};

export default Oauth
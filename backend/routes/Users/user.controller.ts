import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {GoogleSignInUser, SignInUser, User} from "../../Types.ts";
import {
  authenticate,
  authenticateWithGoogle,
  createNewUser,
  findUser,
  listAllUsers,

} from "../../models/user.model.ts";
import {BadRequest} from "http-errors";
import {faker} from "@faker-js/faker";
import {HTTPException} from "../../middlewares/error.middleware.ts";

/**
 * Sign Up Controller Function that Create The new User
 * @param req
 * @param res
 * @route POST user/auth/sign-up/
 */
async function signUp(req: Request<{}, {}, User>, res: Response) {
  const user = req.body
  if (!user.username || !user.email || !user.password) {
    return res.status(StatusCodes.BAD_REQUEST).json({error: "All Fields Are Mandatory"})
  }
  try {
    const [token, newUser] = await createNewUser(user)
    return res.status(StatusCodes.CREATED).json({token, user: newUser})
  } catch (e: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message
    })

  }
}

/**
 * Sign In Function That Return The Token And User Object
 * @param req
 * @param res
 * @route POST user/auth/sign-in/
 *
 */
async function signIn(req: Request<{}, {}, SignInUser>, res: Response) {
  const {email, password} = req.body
  try {
    const [token, user] = await authenticate(email, password)
    return res.status(StatusCodes.OK).json({token, user})
  } catch (e: any) {
    return res.status(e.statusCode).json({error: e.message})
  }
}

async function signInWithGoogle(req: Request<{}, {}, GoogleSignInUser>, res: Response) {
  try {
    const [token, user] = await authenticateWithGoogle(req.body)
    return res.status(StatusCodes.OK).json({token, user})
  } catch (e: any) {
    return res.status(e.statusCode).json({error: e.message})
  }
}


// Just For Development
async function list(req: Request, res: Response) {
  return res.status(StatusCodes.OK).json(await listAllUsers())
}


export default {
  signUp,
  signIn,
  list,
  signInWithGoogle
}

import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {User} from "../../Types.ts";
import {createNewUser, listAllUsers} from "../../models/user.model.ts";
import {BadRequest} from "http-errors";

/**
 * Sign Up Controller Function that Create The new User
 * @param req
 * @param res
 * @param next
 * @route POST user/auth/sign-up/
 */
async function signUp(req: Request<{}, {}, User>, res: Response, next: NextFunction) {
  const user = req.body
  if (!user.username || !user.email || !user.password) {
    return res.status(StatusCodes.BAD_REQUEST).json({error: "All Fields Are Mandatory"})
  }
  try {
    const createdUser = await createNewUser(user)
    return res.sendStatus(StatusCodes.CREATED)
  } catch (e: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message
    })
    // next(e)
  }


}

// Just For Development
async function list(req: Request, res: Response) {
  return res.status(StatusCodes.OK).json(await listAllUsers())
}


export default {
  signUp,
  list
}

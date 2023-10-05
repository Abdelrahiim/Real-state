import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {User} from "../../Types.ts";
import {createNewUser, listAllUsers} from "../../models/user.model.ts";

async function signUp(req: Request<{}, {}, User>, res: Response) {
  const user = req.body
  if (!user.username || !user.email || !user.password) {
    return res.status(StatusCodes.BAD_REQUEST).json({error: "All Fields Are Mandatory"})
  }
  const createdUser = await createNewUser(user)
  return res.sendStatus(StatusCodes.CREATED)
}

async function list(req: Request, res: Response) {
  return res.status(StatusCodes.OK).json(await listAllUsers())
}


export default {
  signUp,
  list
}

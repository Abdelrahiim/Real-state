import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {jwtVerify, JWTPayload} from "jose";
import {SECRET_KEY} from "../services/Settings.ts";
import * as core from "express-serve-static-core";
import chalk from "chalk";

export interface CustomRequest<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = core.Query, Locals extends Record<string, any> = Record<string, any>> extends Request {
  userId: string | JWTPayload;
}

async function VerifyTokenMiddleware(req:Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies["_auth"];
    if (!token) {
      throw new Error()
    }
    const {payload, protectedHeader} = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY))
    // @ts-ignore
    req.userId = payload["userId"];
    next()
  } catch (e) {
    return res.status(StatusCodes.UNAUTHORIZED).json({error: "UnAuthorized"})

  }

}

export default VerifyTokenMiddleware
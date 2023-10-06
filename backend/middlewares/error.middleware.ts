import {NextFunction, Request, Response} from "express";

export class HTTPException extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
  }
}

export const errorHandler: (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void = (err, req, res, next) => {
  // If the error is a custom error, send a response with the error details.
  if (err instanceof HTTPException) {
    res.status(err.statusCode).json({
      error: err.message,
    });
  } else {
    // If the error is not a custom error, send a generic response with the error message.
    res.status(500).json({
      error: err.message,
    });
  }
};

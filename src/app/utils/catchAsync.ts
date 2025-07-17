import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env";

type CatchAsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
//here catchAsync is a higher order function

export const catchAsync =
  (fn: CatchAsyncHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Promise.resolve(fn(req, res, next)).catch((error: any) => {
      if (envVar.NODE_ENV === "development") {
        console.log(error);
      }
      next(error);
    });
  };

import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { StatusCodes } from "http-status-codes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
  const loginInfo = await AuthServices.credentialsLogin(req.body);
  sendResponse(res, {
    success:true,
    message: "User logged in Successfully",
    statusCode: StatusCodes.OK,
    data: loginInfo
  })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
  // const refreshToken = req.cookies.refreshToken;
  const refreshToken = req.headers.authorization as string;
  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);
  sendResponse(res, {
    success:true,
    message: "User logged in Successfully",
    statusCode: StatusCodes.OK,
    data: tokenInfo
  })
})

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
};

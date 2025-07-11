/* eslint-disable @typescript-eslint/no-unused-vars */
import {NextFunction, Request, Response } from "express";
import httpStatus, { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
// import AppError from "../../errorHelper/AppError";

const createUser = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
  // throw new AppError(400, "faltu");
  //the database comunication and the business logic is shifted to the service part
  const result = await UserServices.createUser(req.body);
  sendResponse(res, {
    success:true,
    message: "User Created Successfully",
    statusCode: StatusCodes.CREATED,
    data: result.user,
    meta: {
      total: result.total
    }
  })
});

const getAllUser = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
  const result = await UserServices.getAllUsers();
  sendResponse(res, {
    success:true,
    message: "All Users Retrieved Successfully",
    statusCode: StatusCodes.CREATED,
    data: result
  })
});
export const UserControllers = {
  createUser,
  getAllUser,
};

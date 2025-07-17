import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionServices } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createDivision = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DivisionServices.createDivision(req.body);
    sendResponse(res, {
      success: true,
      message: "User Created Successfully",
      statusCode: StatusCodes.CREATED,
      data: result.division,
      meta: {
        total: result.total,
      },
    });
  }
);

const updateDivision = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await DivisionServices.updateDivision(id,req.body);
    sendResponse(res, {
      success: true,
      message: "Division Updated Successfully",
      statusCode: StatusCodes.OK,
      data: result.updatedDivision,
    });
  }
);

export const DivisionControllers = {
  createDivision,
  updateDivision
};

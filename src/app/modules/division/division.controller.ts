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
    const result = await DivisionServices.updateDivision(id, req.body);
    sendResponse(res, {
      success: true,
      message: "Division Updated Successfully",
      statusCode: StatusCodes.OK,
      data: result.updatedDivision,
    });
  }
);

const getAllDivisions = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionServices.getAllDivisions();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Divisions retrieved",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await DivisionServices.getSingleDivision(slug);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Divisions retrieved",
    data: result.data,
    meta: result.meta,
  });
});

export const DivisionControllers = {
  createDivision,
  updateDivision,
  getAllDivisions,
  getSingleDivision
};

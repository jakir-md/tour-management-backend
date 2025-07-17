/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env";
import AppError from "../errorHelper/AppError";
import { handleDuplicateError } from "../helper/handleDuplicateError";
import { handleCastError } from "../helper/handleCastError";
import { handleZodError } from "../helper/handleZodError";
import { handleValidationError } from "../helper/handleValidationError";


export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something went wrong. Error: ${error.message}`;

  if(envVar.NODE_ENV === "development"){
    console.log(error);
  }

  let errorSources: any = []; //for validating mongoose errors. like in the backend isDeleted: boolean and suppose we sent string from the forntend it's a castError. Another error could be isActive: enum, but we sent wrong enum value from the frontend which is a validationError

  if (error.code === 11000) {
    //duplicate error from mongodb
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (error.name === "CastError") {
    // invalid objectId error mongodb
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (error.name === "ZodError") {
    const simplifiedError = handleZodError(error);
    statusCode = 400;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error.name === "ValidationError") {  //mongoose validation/validator
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else {
    statusCode = 500;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error: envVar.NODE_ENV === "development" ? error : null,
    stack: envVar.NODE_ENV === "development" ? error.stack : null,
  });
};

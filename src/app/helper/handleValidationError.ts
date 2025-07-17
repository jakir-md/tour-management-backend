import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";

export const handleValidationError = (error: mongoose.Error.ValidationError):TGenericErrorResponse => {
  //for validating mongoose errors. like in the backend isDeleted: boolean and suppose we sent string from the forntend it's a castError. Another error could be isActive: enum, but we sent wrong enum value from the frontend which is a validationError
  const errorSources: TErrorSources[] = [];
  const errors = Object.values(error.errors);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors.forEach((errorObject: any) =>
    errorSources.push({
      path: errorObject.path,
      message: errorObject.message,
    })
  );
  return {
    statusCode: 400,
    message: "Validation Error Occurred..",
    errorSources,
  };
};
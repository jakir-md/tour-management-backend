/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";

export const handleZodError = (error: any):TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];
  error.issues.forEach((issue: any) =>
    errorSources.push({
      path: issue.path.reverse().join(" inside "),
      message: issue.message,
    })
  );

  return {
    statusCode: 400,
    message: "Zod Error Detected..",
    errorSources,
  };
};
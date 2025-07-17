import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { verifyToken } from "../utils/jwt";
import { envVar } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { StatusCodes } from "http-status-codes";
import { ISActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(403, "Token not found");
      }

      const decodedToken = verifyToken(
        token,
        envVar.JWT_ACCESS_SECRET
      ) as JwtPayload; //verify kore dekhtese j ami ei token diyechilam ki na

      const isUserExists = await User.findOne({ email: decodedToken.email });

      if (!isUserExists) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exists..");
      }
      if (isUserExists.isActive === (ISActive.BLOCKED || ISActive.INACTIVE)) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `User is ${isUserExists.isActive}`
        );
      }

      if (isUserExists.isDeleted) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted..");
      }

      console.log(decodedToken,decodedToken.role);
      if (!authRoles.includes(decodedToken.role)) {
        throw new AppError(403, "You are not authorized to view the content");
      }

      req.user = decodedToken;
      next();
    } catch (error) {
      next(error);
    }
  };

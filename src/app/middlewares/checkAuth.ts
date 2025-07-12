import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { verifyToken } from "../utils/jwt";
import { envVar } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(403, "Token not found");
      }

      const verifiedToken = verifyToken(
        token,
        envVar.JWT_ACCESS_SECRET
      ) as JwtPayload; //verify kore dekhtese j ami ei token diyechilam ki na
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not authorized to view the content");
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };

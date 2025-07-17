import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../config/env";
import { ISActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import { StatusCodes } from "http-status-codes";
import AppError from "../errorHelper/AppError";

export const getUserToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    email: user.email,
    role: user.role,
    name: user.name,
    userId: user._id,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVar.JWT_ACCESS_SECRET,
    envVar.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVar.JWT_REFRESH_SECRET,
    envVar.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const getNewAccessTokenWithRefreshtoken = async (refreshToken: string) => {
  const verifiedToken = verifyToken(
    refreshToken,
    envVar.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExists = await User.findOne({ email: verifiedToken.email });

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

  const payload = {
    email: isUserExists.email,
    role: isUserExists.role,
    name: isUserExists.name,
    userId: isUserExists._id,
  };

  const accessToken = generateToken(
    payload,
    envVar.JWT_ACCESS_SECRET,
    envVar.JWT_ACCESS_EXPIRES
  );

  return accessToken;
};

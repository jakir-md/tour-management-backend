import { StatusCodes } from "http-status-codes";
import AppError from "../errorHelper/AppError";
import { ISActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";
import { getUserToken } from "../utils/userTokens";
import { generateToken, verifyToken } from "../utils/jwt";
import { envVar } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExists = await User.findOne({ email });

  if (!isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't Exists");
  }

  const isPassMatched = await bcrypt.compare(
    password as string,
    isUserExists.password as string
  );
  if (!isPassMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password doesn't match");
  }

  const { accessToken, refreshToken } = getUserToken(payload);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExists.toObject();
  return {
    accessToken,
    refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
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
  return {
    accessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
};

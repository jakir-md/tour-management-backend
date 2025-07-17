import { StatusCodes } from "http-status-codes";
import AppError from "../errorHelper/AppError";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";
import {
  getNewAccessTokenWithRefreshtoken,
  getUserToken,
} from "../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../config/env";

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

  const { accessToken, refreshToken } = getUserToken(isUserExists);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExists.toObject();
  return {
    accessToken,
    refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const accessToken = await getNewAccessTokenWithRefreshtoken(refreshToken);
  return {
    accessToken,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Old Password Doesn't match");
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVar.BCRYPT_SALT_ROUND)
  );
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  user!.save();
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
};

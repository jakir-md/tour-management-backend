import { envVar } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

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
  }
};

//the service layer implements all the business logics
//connects with the database

import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IAuthProviders, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVar } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exists");
  }
  const authProvider: IAuthProviders = {
    provider: "credentials",
    providerId: email as string,
  };

  const hashedPass = await bcrypt.hash(
    password as string,
    Number(envVar.BCRYPT_SALT_ROUND)
  );

  const user = await User.create({
    email,
    password: hashedPass,
    auths: [authProvider],
    ...rest,
  });
  const total = await User.countDocuments();
  return {
    user,
    total,
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExists = await User.findById(userId);

  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found.");
  }

  if (payload.role) {
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized.");
    }

    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized.");
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      envVar.BCRYPT_SALT_ROUND
    );
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }); //to run validation while updating using mongoose

  return updatedUser;
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};
export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
};

//workflow
// route-matching --> controller --> service --> model --> db
// amra kaj korar somoy ulta dik theke asbo

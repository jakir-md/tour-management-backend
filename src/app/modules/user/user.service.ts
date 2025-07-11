//the service layer implements all the business logics
//connects with the database

import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IAuthProviders, IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";

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

  const hashedPass = await bcrypt.hash(password as string, 10);

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

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};
export const UserServices = {
  createUser,
  getAllUsers,
};

//workflow
// route-matching --> controller --> service --> model --> db
// amra kaj korar somoy ulta dik theke asbo

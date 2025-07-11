import { StatusCodes } from "http-status-codes";
import AppError from "../errorHelper/AppError";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { envVar } from "../config/env";

const credentialsLogin = async (payload:Partial<IUser>) => {
    const {email, password} = payload;
    const isUserExists = await User.findOne({email});

    if(!isUserExists){
        throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't Exists");
    }

    const isPassMatched = await bcrypt.compare(password as string, isUserExists.password as string);
    if(!isPassMatched){
        throw new AppError(StatusCodes.BAD_REQUEST, "Password doesn't match");
    }

    const jwtPayload = {
        email: isUserExists.email,
        role: isUserExists.role,
        name: isUserExists.name,
        userId: isUserExists._id
    }

    const accessToken = generateToken(jwtPayload, envVar.JWT_ACCESS_SECRET, envVar.JWT_ACCESS_EXPIRES);

    return {    
        accessToken
    }
}

export const AuthServices = {
    credentialsLogin,
}
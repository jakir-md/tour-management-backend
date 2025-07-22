import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}

export enum ISActive {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
    INACTIVE = "INACTIVE"
}

export interface IAuthProviders { // email+password or google
    provider: "google" | "credentials";
    providerId: string;
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password ?: string;
    picture ?: string;
    phone ?: string;
    address ?: string;
    isActive ?: ISActive;
    isDeleted ?: boolean;
    isVerified ?: boolean;
    role: Role;
    auths: IAuthProviders[]; // 1 ta interface er vitore arekta interface. tai schema bananor somoy embeded schema banaite hobe
    bookings?: Types.ObjectId[];
    guides?: Types.ObjectId[];
}
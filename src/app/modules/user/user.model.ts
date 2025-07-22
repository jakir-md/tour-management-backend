import { model, Schema } from "mongoose";
import { IAuthProviders, ISActive, IUser, Role } from "./user.interface";

const authSchema = new Schema<IAuthProviders>(
  {
    provider: String,
    providerId: String,
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique:true },
    password: { type: String, required: false },
    phone: { type: String, required: false },
    picture: { type: String, required: false },
    address: { type: String, required: false },
    isActive: {
      type: String,
      enum: Object.values(ISActive),
      required: false,
      default: ISActive.ACTIVE,
    },
    isVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },

    // for auths We'll create an embeded schema. mane etar jonne alada akta schema
    auths: [authSchema],

    // guides
    // bookings
    // we'll create them later

    bookings: [Schema.Types.ObjectId]
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

//now creating the model
export const User = model<IUser>("User", userSchema);

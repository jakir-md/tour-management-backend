import z, { string } from "zod";
import { ISActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name can be maximum 50 characters long" }),
  email: z.string().email({ message: "Invalid email address format" }),
  phone: string({
    invalid_type_error: "Phone number must be a string",
  })
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Invalid Phone Number",
    })
    .optional(),
  address: string({ invalid_type_error: "Address must be a string" })
    .max(200, { message: "Address length cannot exceed 200" })
    .optional(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Z])/, { message: "At least one uppercase" })
    .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
      message: "At least one special character",
    })
    .regex(/(?=.*\d)/, { message: "At least one number" }),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name can be maximum 50 characters long" })
    .optional(),
  phone: string({
    invalid_type_error: "Phone number must be a string",
  })
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Invalid Phone Number",
    })
    .optional(),
  address: string({ invalid_type_error: "Address must be a string" })
    .max(200, { message: "Address length cannot exceed 200" })
    .optional(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Z])/, { message: "At least one uppercase" })
    .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
      message: "At least one special character",
    })
    .regex(/(?=.*\d)/, { message: "At least one number" })
    .optional(),
  isActive: z.enum(Object.values(ISActive) as [string]).optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isDeleted: z.boolean({
    invalid_type_error: "isDeleted must be a boolean value",
  }),
  isVerified: z.boolean({
    invalid_type_error: "isVerified must be a boolean value",
  }),
});

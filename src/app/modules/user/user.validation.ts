import z from "zod";
import { isActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name Must be a string" })
    .min(2, { message: "Name too Short. Minimum 2 character long " })
    .max(50, { message: "Name to long" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/(?=.*[a-z])/, {
      message: "Password must contain at least 1 lowercase letter.",
    })
    .regex(/(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    })
    // eslint-disable-next-line no-useless-escape
    .regex(/(?=.*[!@#$%^&*(),.?":{}|<>[\]\\\/\-_=+`~])/, {
      message: "Password must contain at least 1 special character.",
    }),
  phone: z
    .string({ invalid_type_error: "Phone number must be a string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),

  address: z
    .string({ invalid_type_error: "Address must be a string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
});

// Update

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name Must be a string" })
    .min(2, { message: "Name too Short. Minimum 2 character long " })
    .max(50, { message: "Name to long" })
    .optional(),
  // password: z
  //   .string()
  //   .min(8, { message: "Password must be at least 8 characters long." })
  //   .regex(/(?=.*[A-Z])/, {
  //     message: "Password must contain at least 1 uppercase letter.",
  //   })
  //   .regex(/(?=.*[a-z])/, {
  //     message: "Password must contain at least 1 lowercase letter.",
  //   })
  //   .regex(/(?=.*\d)/, {
  //     message: "Password must contain at least 1 number.",
  //   })
  //   // eslint-disable-next-line no-useless-escape
  //   .regex(/(?=.*[!@#$%^&*(),.?":{}|<>[\]\\\/\-_=+`~])/, {
  //     message: "Password must contain at least 1 special character.",
  //   })
  //   .optional(),
  phone: z
    .string({ invalid_type_error: "Phone number must be a string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(isActive) as [string]).optional(),
  isDeleted: z
    .boolean({ invalid_type_error: "isDeleted must be true or false" })
    .optional(),
  isVerified: z
    .boolean({ invalid_type_error: "isDeleted must be true or false" })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be a string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
});

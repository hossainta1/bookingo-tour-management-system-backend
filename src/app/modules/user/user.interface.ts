import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

export enum isActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

// Auth providers
/*
1. Email password
2. Google authentication


*/

export interface IAuthProvider {
  provider: "google" | "credentials"; // google, "credential"
  providerId: string;
}

export interface IUser {
  _id ?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: string;
  isActive?: isActive;
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}

import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { isActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/AppError";

export const createUserToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};


export const createNewAccessTokenWithRefreshToken = async (refreshToken : string) => {
    const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  if (isUserExist.isActive === isActive.BLOCKED || isUserExist.isActive === isActive.INACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is blocked or Inastive");
  }

  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
  }


  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken =generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_EXPIRES);
  
  return accessToken
}
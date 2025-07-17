import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import { isActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No token Recived");
      }

      const verifedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({ email: verifedToken.email });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }

      if (
        isUserExist.isActive === isActive.BLOCKED ||
        isUserExist.isActive === isActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "User is blocked or Inastive"
        );
      }

      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
      }

      if (!authRoles.includes(verifedToken.role)) {
        throw new AppError(403, "You are not permited to view this route");
      }

      req.user = verifedToken;

      next();
    } catch (error) {
      next(error);
    }
  };

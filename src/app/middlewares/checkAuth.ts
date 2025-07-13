import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...authRoles : string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No token Recived");
      }

      const verifedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

      if (!authRoles.includes(verifedToken.role)) {
        throw new AppError(403, "You are not permited to view this route");
      }

      req.user = verifedToken

      next();

    } catch (error) {
      next(error);
    }
  } 

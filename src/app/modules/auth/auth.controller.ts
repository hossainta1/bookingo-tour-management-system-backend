/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserToken } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await AuthServices.credentialLogin(req.body);

    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(401, err))

        // return new AppError(401, err);
      }

      if (!user) {
        // return new AppError(401, info.mesaage);
         return next(new AppError(401, info.mesaage))
      }

      const userTokens = createUserToken(user);

      const { password: pass, ...rest } = user.toObject();

      setAuthCookie(res, userTokens);
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Login Successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);

    // res.cookie("accessToken", loginInfo.accessToken, {
    //   httpOnly : true,
    //   secure : false
    // })
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token recived from cookies"
      );
    }
    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );

    //  res.cookie("accessToken", tokenInfo.accessToken, {
    //   httpOnly : true,
    //   secure : false
    // })

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New Access token retrive Successfully",
      data: tokenInfo,
    });
  }
);

const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logout Successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    await AuthServices.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password change Successfully",
      data: null,
    });
  }
);

const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    // /booking => booking , => "/" => ""
    const user = req.user;

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    const tokenInfo = createUserToken(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthContorllers = {
  credentialLogin,
  getNewAccessToken,
  logOut,
  resetPassword,
  googleCallbackController,
};

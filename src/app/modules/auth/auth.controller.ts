/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
  
    const loginInfo = await AuthServices.credentialLogin(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Login Successfully",
      data: loginInfo,
    });
  }
);

export const AuthContorllers = {
  credentialLogin,
};

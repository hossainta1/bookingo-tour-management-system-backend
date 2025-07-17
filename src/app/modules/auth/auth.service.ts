/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";

import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";


// const credentialLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExist = await User.findOne({ email });

//   if (!isUserExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
//   }

//   const isPasswordMatch = await bcryptjs.compare(
//     password as string,
//     isUserExist.password as string
//   );

//   if (!isPasswordMatch) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
//   }

//   // const jwtPayload = {
//   //   userId: isUserExist._id,
//   //   email: isUserExist.email,
//   //   role: isUserExist.role,
//   // };
//   // const accessToken =generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_EXPIRES);

//   // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES );

//   const userToken = createUserToken(isUserExist);

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password: pass, ...rest } = isUserExist.toObject();

//   return {
//     accessToken: userToken.accessToken,
//     refreshToken: userToken.refreshToken,
//     user: rest,
//   };
// };

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)


  return {
    accessToken : newAccessToken
  };
};

const resetPassword = async (oldPassword : string, newPassword: string, decodedToken : JwtPayload) => {
  const user = await User.findById(decodedToken.userId)
   const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string);

   if(!isOldPasswordMatch){
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password Doesnot Match");
   }

   user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
   user!.save();
};


export const AuthServices = {
  // credentialLogin,
  getNewAccessToken,
  resetPassword
};

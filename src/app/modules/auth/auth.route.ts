import { NextFunction, Request, Response, Router } from "express";
import { AuthContorllers} from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";


const router = Router();
router.post("/login", AuthContorllers.credentialLogin)
router.post("/refresh-token", AuthContorllers.getNewAccessToken)
router.post("/logout", AuthContorllers.logOut)
router.post("/change-password", checkAuth(...Object.values(Role)), AuthContorllers.changePassword)
router.post("/forgot-password", AuthContorllers.forgotPassword)
router.post("/set-password", checkAuth(...Object.values(Role)), AuthContorllers.setPassword)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthContorllers.resetPassword)

// Frontend -> forget-password -> email -> user status check -> short expiration token (valid for 10 min) -> email -> Fronted Link http://localhost:5173/reset-password?email=saminisrar1@gmail.com&token=token -> frontend e  query theke user er email and token extract anbo -> new password user theke nibe -> backend er /reset-password api -> authorization = token -> newPassword -> token verify -> password hash -> save user password   


//  /booking -> /login -> succesful google login -> /booking frontend
// /login -> succesful google login -> / frontend
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})

// api/v1/auth/google/callback?state=/booking
router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!` }), AuthContorllers.googleCallbackController)



export const authRoutes = router;
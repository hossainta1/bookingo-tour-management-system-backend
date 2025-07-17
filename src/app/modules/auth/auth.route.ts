import { NextFunction, Request, Response, Router } from "express";
import { AuthContorllers} from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";


const router = Router();
router.post("/login", AuthContorllers.credentialLogin)
router.post("/refresh-token", AuthContorllers.getNewAccessToken)
router.post("/logout", AuthContorllers.logOut)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthContorllers.resetPassword)


//  /booking -> /login -> succesful google login -> /booking frontend
// /login -> succesful google login -> / frontend
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})

// api/v1/auth/google/callback?state=/booking
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthContorllers.googleCallbackController)
export const authRoutes = router;
import { Router } from "express";
import { AuthContorllers} from "./auth.controller";


const router = Router();
router.post("/login", AuthContorllers.credentialLogin)

export const authRoutes = router;
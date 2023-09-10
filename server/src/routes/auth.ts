import { Router } from "express";
import loginUser from "../controllers/auth/login";

import authStatus from "../controllers/auth/status";
import signupUser from "../controllers/auth/signup";
import checkUsername from "../controllers/auth/checkUsername";

const router = Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/check-username", checkUsername);
router.get("/status", authStatus);

export default router;

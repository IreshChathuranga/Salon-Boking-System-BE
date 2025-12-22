import { Router } from "express";
import {
  login,
  register,
  refreshToken,
  updateCredentials
} from "../controller/userController";
import {
  googleRegister,
  googleLogin
} from "../controller/googleAuthController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/register/google", googleRegister);
router.post("/login/google", googleLogin);
router.post("/login", login);
router.post("/refreshtoken", refreshToken);
router.put("/updatecredentials", authenticate, updateCredentials);

export default router;
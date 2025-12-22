import { Router } from "express";
import { getProfile, updateProfile,createProfile } from "../controller/profileController";
import { authenticate } from "../middleware/auth";
import {upload} from "../middleware/upload"

const router = Router();

router.get("/userdetail", authenticate, getProfile);

router.put("/userdetail", authenticate,  upload.single("avatar") , updateProfile);
router.post("/userdetail", authenticate, upload.single("avatar"), createProfile);


export default router;

import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorizeRoles } from "../middleware/authRole";
import { getAllStaff, addStaff, updateStaff, deleteStaff ,getPublicStaff} from "../controller/staffController";
import { upload } from "../middleware/upload";


const router = Router();

router.get("/", authenticate, authorizeRoles("ADMIN") ,getAllStaff);
router.get("/public", getPublicStaff);
router.post("/",authenticate, authorizeRoles("ADMIN"), upload.single("avatar"), addStaff);    
router.put("/:id", authenticate, authorizeRoles("ADMIN"),upload.single("avatar"), updateStaff);
router.delete("/:id",authenticate, authorizeRoles("ADMIN"), deleteStaff);

export default router;

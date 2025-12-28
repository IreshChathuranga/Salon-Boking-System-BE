import { Router } from "express";
import { getAllUsers,addAdmin,updateAdmin,deleteAdmin, } from "../controller/admin/adminUserController";
import { authenticate } from "../middleware/auth";
import { authorizeRoles } from "../middleware/authRole";
import { Role } from "../model/user";
import { upload } from "../middleware/upload";

const router = Router();

router.get("/users", authenticate, authorizeRoles(Role.ADMIN),getAllUsers);
router.post("/add", authenticate, authorizeRoles(Role.ADMIN),upload.single("avatar"), addAdmin);
router.put("/:id", authenticate, authorizeRoles(Role.ADMIN),upload.single("avatar"), updateAdmin);
router.delete("/:id", authenticate, authorizeRoles(Role.ADMIN), deleteAdmin);

export default router;

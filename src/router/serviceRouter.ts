import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorizeRoles } from "../middleware/authRole";
import { getAllServices, addService, updateService, deleteService } from "../controller/serviceController";

const router = Router();

router.get("/", getAllServices);
router.post("/", authenticate, authorizeRoles("ADMIN"),addService);
router.put("/:id",authenticate, authorizeRoles("ADMIN"), updateService);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"),deleteService);

export default router;

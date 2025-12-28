import { Router } from "express"
import { authenticate } from "../middleware/auth"
import {createCheckoutSession , confirmPayment, getAllPayments} from "../controller/paymentController"
import { authorizeRoles } from "../middleware/authRole"

const router = Router()

router.post("/create-checkout-session", authenticate, createCheckoutSession);
router.post("/confirm", authenticate, confirmPayment);
router.get("/", authenticate, authorizeRoles("ADMIN"), getAllPayments) 

export default router

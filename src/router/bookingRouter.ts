// router/bookingRouter.ts
import { Router } from "express"
import { authenticate } from "../middleware/auth"
import {
  createBooking,
  deleteBooking,
  markAsPaid
} from "../controller/bookingController"

const router = Router()

router.post("/", authenticate, createBooking)
router.delete("/:id", authenticate, deleteBooking)
router.put("/:id/pay", authenticate, markAsPaid)

export default router

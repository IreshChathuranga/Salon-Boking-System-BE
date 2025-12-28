// router/bookingRouter.ts
import { Router } from "express"
import { authenticate } from "../middleware/auth"
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  updateBooking,
  markAsPaid
} from "../controller/bookingController"
import { authorizeRoles } from "../middleware/authRole"

const router = Router()

router.post("/", authenticate, createBooking)
router.delete("/:id", authenticate, deleteBooking)
router.get("/", authenticate, authorizeRoles("ADMIN"), getAllBookings) 
router.put("/:id", authenticate, updateBooking)

export default router

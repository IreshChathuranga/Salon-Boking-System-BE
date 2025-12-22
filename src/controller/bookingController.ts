import { Request, Response } from "express"
import { Booking } from "../model/booking"

export const createBooking = async (req: any, res: Response) => {
  const booking = new Booking({
    user: req.user.sub,
    ...req.body,
    status: "PENDING",
  })

  await booking.save()
  res.status(201).json(booking)
}

export const deleteBooking = async (req: any, res: Response) => {
  await Booking.findOneAndDelete({
    _id: req.params.id,
    user: req.user.sub,
    status: "PENDING",
  })

  res.json({ message: "Booking removed" })
}

export const markAsPaid = async (req: any, res: Response) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: "PAID" },
    { new: true }
  )
  res.json(booking)
}

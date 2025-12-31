import { Request, Response } from "express"
import { Booking } from "../model/booking"

export const createBooking = async (req: any, res: Response) => {
  const userId = req.user.sub;
  const {
    bookingDate,
    bookingTime,
    stylistName,
  } = req.body;

  const existingBooking = await Booking.findOne({
    bookingDate,
    bookingTime,
    stylistName,
    status: { $in: ["PENDING", "PAID"] },
  });

  if (existingBooking) {
    return res.status(409).json({
      message: "This slot is already booked by you",
    });
  }

  const booking = await Booking.create({
    user: userId,
    ...req.body,
    status: "PENDING",
  });

  res.status(201).json(booking);
}

export const deleteBooking = async (req: any, res: Response) => {
  const { id } = req.params
  const userId = req.user.sub
  const isAdmin = req.user.roles?.includes("ADMIN")

  const booking = await Booking.findById(id)

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" })
  }

  if (!isAdmin && booking.user.toString() !== userId) {
    return res.status(403).json({ message: "Access denied" })
  }

  if (booking.status === "PAID") {
    return res.status(400).json({ message: "Paid booking cannot be deleted" })
  }

  await Booking.findByIdAndDelete(id)

  res.json({ message: "Booking deleted successfully" })
}


export const markAsPaid = async (req: any, res: Response) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: "PAID" },
    { new: true }
  )
  res.json(booking)
}

export const getAllBookings = async (req: any, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email") 
      .sort({ createdAt: -1 })      

    res.status(200).json(bookings)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch bookings" })
  }
}

export const updateBooking = async (req: any, res: Response) => {
  const { id } = req.params
  const userId = req.user.sub
  const isAdmin = req.user.roles?.includes("ADMIN")

  const booking = await Booking.findById(id)

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" })
  }

  if (!isAdmin && booking.user.toString() !== userId) {
    return res.status(403).json({ message: "Access denied" })
  }

  if (booking.status === "PAID") {
    return res.status(400).json({ message: "Paid booking cannot be updated" })
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  )

  res.json(updatedBooking)
}

export const getMyBookings = async (req: any, res: Response) => {
  try {
    const userId = req.user.sub;

    const bookings = await Booking.find({ user: userId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to load booking history" });
  }
}


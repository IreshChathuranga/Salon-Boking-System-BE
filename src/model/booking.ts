import mongoose, { Schema, Document } from "mongoose"

export enum BookingStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId
  serviceName: string
  servicePrice: number
  serviceDuration: number
  bookingDate: string
  bookingTime: string
  stylistName: string
  stylistRole: string
  status: BookingStatus
}

const bookingSchema = new Schema<IBooking>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  serviceName: String,
  servicePrice: Number,
  serviceDuration: Number,
  bookingDate: String,
  bookingTime: String,
  stylistName: String,
  stylistRole: String,
  status: {
    type: String,
    enum: Object.values(BookingStatus),
    default: BookingStatus.PENDING,
  },
}, { timestamps: true })

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema)

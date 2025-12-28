import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  bookingIds: mongoose.Types.ObjectId[];
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: "PAID";
}

const paymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookingIds: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
    stripeSessionId: {
      type: String,
      required: true,
      unique: true, // 🔥 KEY FIX
    },
    amount: Number,
    currency: String,
    status: { type: String, default: "PAID" },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

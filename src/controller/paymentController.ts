import { Request, Response } from "express"
import { stripe } from "../config/stripe"
import { Booking } from "../model/booking"
import { Payment } from "../model/payment"
import mongoose from "mongoose";

export const createCheckoutSession = async (req: any, res: Response) => {
  const { bookingIds } = req.body;

  const bookings = await Booking.find({
    _id: { $in: bookingIds },
    user: req.user.sub,
    status: "PENDING",
  });

  if (!bookings.length) {
    return res.status(400).json({ message: "No valid bookings" });
  }

  const totalAmount = bookings.reduce(
    (sum, b) => sum + b.servicePrice,
    0
  );

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "lkr",
          product_data: {
            name: "Salon Booking",
          },
          unit_amount: totalAmount * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingIds: bookingIds.join(","),
      userId: req.user.sub,
    },
    success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/booking`,
  });

  res.json({ url: session.url });
};


export const confirmPayment = async (req: any, res: Response) => {
  const { bookingIds, stripeSessionId, amount, currency } = req.body;

  try {
    if (!bookingIds || bookingIds.length === 0) {
      return res.status(400).json({ message: "No booking IDs" });
    }

    const existingPayment = await Payment.findOne({ stripeSessionId });

    if (existingPayment) {
      return res.json({
        message: "Payment already processed",
        payment: existingPayment,
      });
    }

    const objectIds = bookingIds.map(
      (id: string) => new mongoose.Types.ObjectId(id)
    );

    await Booking.updateMany(
      {
        _id: { $in: objectIds },
        user: req.user.sub,
        status: "PENDING",
      },
      { $set: { status: "PAID" } }
    );

    const payment = await Payment.create({
      user: req.user.sub,
      bookingIds: objectIds,
      stripeSessionId,
      amount,
      currency,
      status: "PAID",
    });

    res.status(201).json({
      message: "Payment confirmed",
      payment,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      const payment = await Payment.findOne({ stripeSessionId });
      return res.json({ payment });
    }

    console.error("Payment confirm error:", err);
    res.status(500).json({ message: "Payment save failed" });
  }
};

export const getAllPayments = async (req: any, res: Response) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")                
      .populate({
        path: "bookingIds",
        select: "serviceName bookingDate bookingTime servicePrice"
      })                                              
      .sort({ createdAt: -1 })                       

    res.status(200).json(payments)
  } catch (error) {
    console.error("Get all payments error:", error)
    res.status(500).json({ message: "Failed to fetch payments" })
  }
}
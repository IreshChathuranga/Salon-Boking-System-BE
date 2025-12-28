import { Request, Response } from "express"
import Stripe from "stripe"
import { Booking } from "../model/booking"
import {Payment} from "../model/payment"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature error", err);
    return res.status(400).send("Webhook Error");
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const bookingIds =
      session.metadata?.bookingIds?.split(",") ?? [];

    if (!bookingIds.length) {
      return res.json({ received: true });
    }

    await Booking.updateMany(
      { _id: { $in: bookingIds } },
      { status: "PAID" }
    );

    await Payment.create({
      user: session.metadata!.userId,
      bookingIds,
      stripeSessionId: session.id,
      amount: (session.amount_total ?? 0) / 100,
      currency: session.currency,
      status: "PAID",
    });

    console.log("Payment saved & bookings updated");
  }

  res.json({ received: true });
};


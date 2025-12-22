import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { authenticate } from "../middleware/auth";
import { Booking } from "../model/booking";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const router = express.Router();

router.post("/create-checkout-session", authenticate, async (req, res) => {
  try {
    const { bookingId, amount } = req.body; 

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "lkr",
            product_data: { name: "Salon Booking" },
            unit_amount: amount * 100, 
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?bookingId=${bookingId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Stripe session creation failed" });
  }
});

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"]!;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const bookingId = session.client_reference_id;

    await Booking.findByIdAndUpdate(bookingId, { status: "PAID" });
  }

  res.json({ received: true });
});

export default router;

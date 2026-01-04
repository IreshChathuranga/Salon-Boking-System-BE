import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import userRouter from "./router/userRouter"
import profileRouter from "./router/profileRouter";
import staffRouter from "./router/staffRouter";
import serviceRouter from "./router/serviceRouter";
import bookingRouter from "./router/bookingRouter"
import bodyParser from "body-parser"
import { stripeWebhook } from "./controller/stripeWebhook"
import paymentRouter from "./router/paymentRouter"
import adminRoutes from "./router/adminUserRouter";

dotenv.config()

const SERVER_PORT = process.env.SERVER_PORT
const MONGO_URI = process.env.MONGO_URI as string

const app = express()


app.use(
  cors({
    origin: ["http://localhost:5173","https://salon-boking-system-fe.vercel.app"],
    credentials: true,
  })
)
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
)
app.use(express.json())
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Salon Booking Backend is running 🚀"
  });
});
app.use("/api/v1/payment", paymentRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/profile", profileRouter)
app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/service", serviceRouter);
app.use("/api/v1/booking", bookingRouter)
app.use("/api/v1/admin", adminRoutes);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("DB connected"))
  .catch(err => {
    console.error("DB error", err);
    throw err;
  });

export default app;

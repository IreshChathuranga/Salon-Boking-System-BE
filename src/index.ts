import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import userRouter from "./router/userRouter"
import profileRouter from "./router/profileRouter";
import staffRouter from "./router/staffRouter";
import serviceRouter from "./router/serviceRouter";
import bookingRouter from "./router/bookingRouter"

dotenv.config()

const SERVER_PORT = process.env.SERVER_PORT
const MONGO_URI = process.env.MONGO_URI as string

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)

app.use("/api/v1/user", userRouter)
app.use("/api/v1/profile", profileRouter)
app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/service", serviceRouter);
app.use("/api/v1/booking", bookingRouter)

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB connected")
  })
  .catch((err) => {
    console.error(`DB connection fail: ${err}`)
    process.exit(1)
  })

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on ${SERVER_PORT}`)
})

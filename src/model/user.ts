import mongoose, { Document, Schema } from "mongoose"

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export enum Status {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId
    email: string
    password: string
    roles: Role[]
    approved: Status
    name?: String
  phone?: String
  gender?: "Male" | "Female" | "Other"
  avatarUrl?: string  
}

const userSchema = new Schema<IUser>({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, required: true },
  roles: { type: [String], enum: Object.values(Role), default: [Role.USER] },
  approved: {
    type: String,
    enum: Object.values(Status),
    default: Status.PENDING
  },
  name: { type: String },
  phone: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  avatarUrl: { type: String },
})

export const User = mongoose.model<IUser>("User", userSchema)
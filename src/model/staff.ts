import mongoose, { Document, Schema } from "mongoose";

export interface IStaff extends Document {
  name: string;
  email: string;
  phone: string;
  age: number;
  role: string; 
  avatarUrl?: string;
}

const staffSchema = new Schema<IStaff>({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String },
  age: { type: Number, required: true},
  role: { type: String, required: true },
  avatarUrl: { type: String },
});

export const Staff = mongoose.model<IStaff>("Staff", staffSchema);

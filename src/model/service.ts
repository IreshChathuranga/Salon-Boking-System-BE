import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  name: string;
  description?: string;
  price: number;
  duration: number; 
}

const serviceSchema = new Schema<IService>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
});

export const Service = mongoose.model<IService>("Service", serviceSchema);

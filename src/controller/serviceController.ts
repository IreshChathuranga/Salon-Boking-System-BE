import { Request, Response } from "express";
import { Service } from "../model/service";

export const getAllServices = async (req: Request, res: Response) => {
  const services = await Service.find();
  res.status(200).json(services);
};

export const addService = async (req: Request, res: Response) => {
  const { name, description, price, duration } = req.body;
  const service = new Service({ name, description, price, duration });
  await service.save();
  res.status(201).json({ message: "Service added successfully", service });
};

export const updateService = async (req: Request, res: Response) => {
  const { id } = req.params;
  const service = await Service.findByIdAndUpdate(id, req.body, { new: true });
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.status(200).json({ message: "Service updated successfully", service });
};

export const deleteService = async (req: Request, res: Response) => {
  const { id } = req.params;
  const service = await Service.findByIdAndDelete(id);
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.status(200).json({ message: "Service deleted successfully" });
};

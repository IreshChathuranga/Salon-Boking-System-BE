import { Request, Response } from "express";
import { Staff } from "../model/staff";
import { uploadToCloudinary } from "../util/cloudinaryUpload";

export const getAllStaff = async (req: Request, res: Response) => {
  const staff = await Staff.find();
  res.status(200).json(staff);
};

export const getPublicStaff = async (req: Request, res: Response) => {
  const staff = await Staff.find().select(
    "name age role avatarUrl"
  );

  res.status(200).json(staff);
};

export const addStaff = async (req: any, res: Response) => {
  try {
    const { name, email, phone, age ,role } = req.body;

    let avatarUrl = "";
    if (req.file) {
      const uploadResult: any = await uploadToCloudinary(req.file.buffer);
      avatarUrl = uploadResult.secure_url;
    }

    const staff = new Staff({ name, email, phone,age, role, avatarUrl });
    await staff.save();

    res.status(201).json({ message: "Staff added successfully", staff });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

export const updateStaff = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    let avatarUrl;
    if (req.file) {
      const uploadResult: any = await uploadToCloudinary(req.file.buffer);
      avatarUrl = uploadResult.secure_url;
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      {
        ...req.body,
        ...(avatarUrl && { avatarUrl }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedStaff) return res.status(404).json({ message: "Staff not found" });

    res.status(200).json({ message: "Staff updated successfully", staff: updatedStaff });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  const { id } = req.params;
  const staff = await Staff.findByIdAndDelete(id);
  if (!staff) return res.status(404).json({ message: "Staff not found" });
  res.status(200).json({ message: "Staff deleted successfully" });
};

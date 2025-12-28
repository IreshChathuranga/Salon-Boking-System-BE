import { Request, Response } from "express";
import { User, Role} from "../../model/user";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "../../util/cloudinaryUpload";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select("-password") 
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to fetch users"
    })
  }
}

export const addAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, gender } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarUrl: string | undefined;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      avatarUrl = uploadResult.secure_url;
    }

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      avatarUrl,
      roles: [Role.ADMIN],
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Failed to add admin",
    });
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const admin = await User.findById(id);
    if (!admin || !admin.roles.includes(Role.ADMIN)) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { name, phone, gender } = req.body;

    admin.name = name ?? admin.name;
    admin.phone = phone ?? admin.phone;
    admin.gender = gender ?? admin.gender;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      admin.avatarUrl = uploadResult.secure_url;
    }

    await admin.save();

    res.json({
      message: "Admin updated successfully",
      admin,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Failed to update admin",
    });
  }
};


export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const admin = await User.findById(id);
    if (!admin || !admin.roles.includes(Role.ADMIN)) {
      return res.status(404).json({ message: "Admin not found" });
    }

    await admin.deleteOne();

    res.json({ message: "Admin deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to delete admin" });
  }
};

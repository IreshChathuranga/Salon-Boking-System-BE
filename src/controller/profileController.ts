import { Request, Response } from "express";
import { User } from "../model/user";
import { AuthRequest } from "../middleware/auth";
import { uploadToCloudinary } from "../util/cloudinaryUpload";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.sub;
    const user = await User.findById(userId).select("name email phone gender avatarUrl");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({
      profile: {
        name: user.name || "",
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "",
        avatarUrl: user.avatarUrl || "",
      }
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.sub;

    let avatarUrl;
    if (req.file) {
      const uploadResult: any = await uploadToCloudinary(req.file.buffer);
      avatarUrl = uploadResult.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: req.body.name,
        phone: req.body.phone,
        gender: req.body.gender,
        ...(avatarUrl && { avatarUrl }), 
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedUser,
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};


export const createProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.sub; 

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.name || user.phone || user.gender) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    let avatarUrl = "";
    if (req.file) {
      const uploadResult: any = await uploadToCloudinary(req.file.buffer)
      avatarUrl = uploadResult.secure_url;
    }

    user.name = req.body.name;
    user.phone = req.body.phone;
    user.gender = req.body.gender;
    user.avatarUrl = avatarUrl;

    await user.save();

    return res.status(200).json({
      message: "Profile saved successfully",
      user,
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};



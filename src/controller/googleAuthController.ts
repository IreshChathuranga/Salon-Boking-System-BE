import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { User, Role, Status } from "../model/user";
import bcrypt from "bcryptjs"
import { signAccessToken , signRefreshToken } from "../util/tokens";

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

export const googleRegister = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Google code missing" });

    const { tokens } = await client.getToken(code); 
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    if (!email) return res.status(400).json({ message: "Google token invalid" });

    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await User.create({
        email,
        password: hashedPassword,
        roles: [Role.USER],
        approved: Status.APPROVED,
      });
    }

    const accessToken = signAccessToken(user);

    return res.status(201).json({
      message: "User registered successfully via Google",
      data: { id: user._id, email: user.email, roles: user.roles, approved: user.approved },
      accessToken,
    });
  } catch (error: any) {
    console.error("Google register error:", error);
    res.status(500).json({ message: error?.response?.data?.error_description || error?.message });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Google code missing" });

    const { tokens } = await client.getToken(code);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;

    if (!email) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please register using Google first."
      });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return res.status(200).json({
      message: "Google Login Successful",
      accessToken,
      refreshToken,
      data: {
        id: user._id,
        email: user.email,
        roles: user.roles,
        approved: user.approved,
      }
    });

  } catch (error: any) {
    console.error("Google login error:", error);
    return res.status(500).json({
      message: error?.response?.data || error?.message
    });
  }
};

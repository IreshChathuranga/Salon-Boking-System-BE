import { Request, Response } from "express";
import { User, Role } from "../model/user"
import bcrypt from "bcryptjs"
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../util/tokens";
import { sendEmail } from "../util/email";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, confirmPassword, roles } = req.body

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email alrady registered" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const userRoles = Array.isArray(roles) && roles.length > 0
            ? roles.filter((role: string) => Object.values(Role).includes(role as Role))
            : [Role.USER];

        const newUser = new User({
            email,
            password: hashedPassword,
            roles: userRoles
        })

        await newUser.save()
        await sendEmail(newUser.email,
            "Welcome to the Lumière!",
            `<h3>Hello ${newUser.email}</h3>
            <p>Your account has been created successfully.</p>`
        )

        res.status(201).json({
            message: "User registered successfully",
            data: {
                id: newUser._id,
                email: newUser.email,
                roles: newUser.roles,
                approved: newUser.approved
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Something went wrong" });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const valid = await bcrypt.compare(password, existingUser.password)
        if (!valid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        await sendEmail(
            existingUser.email,
            "Login Notification",
            `<p>Your account was logged in at ${new Date().toLocaleString()}</p>`
        );
        const accessToken = signAccessToken(existingUser)
        const refreshToken = signRefreshToken(existingUser)

        return res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: existingUser._id,
                email: existingUser.email,
                roles: existingUser.roles,
                approved: existingUser.approved
            }
        })
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Something went wrong" })
    }
}

export const updateCredentials = async (req: any, res: Response) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.sub);

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Incorrect old password" });

        if (email && email !== user.email) {
            const existing = await User.findOne({ email });
            if (existing) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
        }

        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }

        await user.save();

        return res.status(200).json({
            message: "Credentials updated successfully",
            user: { email: user.email },
        });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Refresh token required" });

    const payload = verifyRefreshToken(token);
    if (!payload) return res.status(403).json({ message: "Invalid or expired refresh token" });

    const user = await User.findById(payload.sub);
    if (!user) return res.status(404).json({ message: "User not found" });

    const accessToken = signAccessToken(user);

    res.status(200).json({ accessToken });
};
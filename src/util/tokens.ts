import dotenv from "dotenv";
import { IUser } from "../model/user";
import jwt, { SignOptions } from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";

const ACCESS_TOKEN_EXP = (process.env.ACCESS_TOKEN_EXP || "30m") as `${number}${"s" | "m" | "h" | "d"}`;
const REFRESH_TOKEN_EXP = (process.env.REFRESH_TOKEN_EXP || "7d") as `${number}${"s" | "m" | "h" | "d"}`;

export const signAccessToken = (user: IUser): string => {
    if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

    const payload = {
        sub: user._id.toString(),
        roles: user.roles,
    };
    const options: SignOptions = { expiresIn: ACCESS_TOKEN_EXP };

    return jwt.sign(payload, JWT_SECRET as jwt.Secret, options);
}

export const signRefreshToken = (user: IUser): string => {
    if (!JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET not defined");

    const payload = {
        sub: user._id.toString(),
    };

    const options: SignOptions = { expiresIn: REFRESH_TOKEN_EXP };

    return jwt.sign(payload, JWT_REFRESH_SECRET as jwt.Secret, options);
};

export const verifyRefreshToken = (token: string): any => {
    try {
        if (!JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET not defined");
        return jwt.verify(token, JWT_REFRESH_SECRET as jwt.Secret);
    } catch (err) {
        console.error("Refresh token verification failed:", err);
        return null;
    }
};

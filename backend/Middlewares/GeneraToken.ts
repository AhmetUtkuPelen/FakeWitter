import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const GenerateToken = async (userId: string, res: Response) => {
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "10d" });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
    });
}

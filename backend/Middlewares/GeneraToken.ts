import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const GenerateToken = async (userId: string, res: Response) => {
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "10d" });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
    });
    
}

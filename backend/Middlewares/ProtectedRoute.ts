import { NextFunction, Request, Response } from "express";
import User from "../Models/UserModel";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";

// ? Define User interface based on your UserModel ? \\
interface IUser extends Document {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  profileImg: string;
  coverImg: string;
  bio: string;
  link: string;
  followers: string[];
  following: string[];
  likedPosts: string[];
}

// ? Extend the Express Request interface ? \\
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}


export const ProtectedRoute = async (req: Request, res: Response, next: NextFunction) => {

    try {
        
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

        if(!decodedToken){
            return res.status(401).json({ message: "Unauthorized !" });
        }

        const user = await User.findById(decodedToken.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized !" });
        }

        req.user = user as unknown as IUser;

        next();

    } catch (error) {
        
        res.status(500).json(error);
        console.log(error);

    }

}

import { Request, Response } from 'express';
import User from '../Models/UserModel';
import bcryptJS from 'bcryptjs';
import { GenerateToken } from '../Middlewares/GeneraToken';
import { Error } from 'mongoose';


// ? REGISTER ? \\
export const Register = async (req: Request, res: Response) => {

    try {
        
        const { username, fullName, password, email } = req.body;

        // ? email format ? \\
		const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existedUser = await User.findOne({ username: username });

        if (existedUser) {
            return res.status(400).json({ message: "A User With This Username Already Exists !" });
        }

        const existedEmail = await User.findOne({ email: email });

        if (existedEmail) {
            return res.status(400).json({ message: "A User With This Email Already Exists !" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password Must Be At Least 6 Characters !" });
        }

        if (fullName.length < 3) {
            return res.status(400).json({ message: "Full Name Must Be At Least 3 Characters !" });
        }

        if (username.length < 3) {
            return res.status(400).json({ message: "Username Must Be At Least 3 Characters !" });
        }

        if (fullName.length > 20) {
            return res.status(400).json({ message: "Full Name Must Be Less Than 20 Characters !" });
        }

        if (username.length > 20) {
            return res.status(400).json({ message: "Username Must Be Less Than 20 Characters !" });
        }

        if (password.length > 20) {
            return res.status(400).json({ message: "Password Must Be Less Than 20 Characters !" });
        }

        if (email.length > 50) {
            return res.status(400).json({ message: "Email Must Be Less Than 50 Characters !" });
        }

        if (!username || !fullName || !password || !email) {
            return res.status(400).json({ message: "All Fields Are Required !" });
        }

        if (password !== password) {
            return res.status(400).json({ message: "Passwords Do Not Match !" });
        }

        // ? hash password ? \\
        const salt = await bcryptJS.genSalt(10);
        const hashedPassword = await bcryptJS.hash(password, salt);

        const newUser = new User({
            username,
            fullName,
            password: hashedPassword,
            email,
        });

        if(newUser){
            
            GenerateToken(newUser?._id.toString(),res)
            
            await newUser.save();
        
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                fullName: newUser.fullName,
                email: newUser.email,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                bio: newUser.bio,
                link: newUser.link,
                followers: newUser.followers,
                following: newUser.following,
                likedPosts: newUser.likedPosts,
            })
            
        }else{

            res.status(400).json({ message: "User Not Created ! Something Went Wrong In Controller !" });
        
        }

    } catch (error) {
        
        res.status(500).json(error);
        console.log(error);

    }

}
// ? REGISTER ? \\




// ? LOGIN ? \\
export const Login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(400).json({ message: "User Not Found !" });
        }

        const isPasswordValid = await bcryptJS.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Password !" });
        }

        // Generate token before sending response
        await GenerateToken(user._id.toString(), res);

        // Then send the response
        res.status(200).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            bio: user.bio,
            link: user.link,
            followers: user.followers,
            following: user.following,
            likedPosts: user.likedPosts,
        });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
}
// ? LOGIN ? \\




// ? LOGOUT ? \\
export const LogOut = async (req: Request, res: Response) => {

    try {
	
        res.cookie("jwt", "", { maxAge: 0 });
	
        res.status(200).json({ message: "Logged out successfully" });
	
    } catch (error) {

        res.status(500).json(error);
        console.log(error);
	
    }

}
// ? LOGOUT ? \\


// ? GET AUTHENTICATED USER ? \\

export const GetAuthenticatedUser = async (req: Request, res: Response) => {

    try {
        
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(400).json({ message: "User Not Found !" });
        }

        res.status(200).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            bio: user.bio,
            link: user.link,
            followers: user.followers,
            following: user.following,
            likedPosts: user.likedPosts,
        })


    } catch (error) {
        
        res.status(500).json(error);
        console.log(error);

    }

}

// ? GET AUTHENTICATED USER ? \\
import { Request, Response } from 'express';
import User from '../Models/UserModel';
import Notification from '../Models/NotificationModel';
import bcryptjs from 'bcryptjs';
import Cloudinary from '../Cloudinary/Cloudinary';
import { IUser } from '../Models/UserModel';

// ? GET USER PROFILE ? \\
export const GetUserProfile = async (req: Request, res: Response) => {

    const username = req.params.username;

    try {

        const user: IUser | null = await User.findOne({ username: username }).select("-password");

        if(!user){
            return res.status(400).json({ error: "User Not Found !" });
        }

        res.status(200).json(user);

    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    }

}
// ? GET USER PROFILE ? \\



// ? GET USER SUGGESTIONS ? \\
export const GetUserSuggestions = async (req: Request, res: Response) => {

    try {
        
        const userId = req.user?._id;

        const usersWhoIAmFollowing = await User.findById(userId).select("following");

        const users:IUser[] = await User.aggregate([
            {
            $match : {
                _id : {$ne: userId }
            }
        },
        {
            $sample : { size : 10 }
        }
        ])

        const filteredUsers = users.filter(user => !usersWhoIAmFollowing?.following.includes(user?._id));

        const suggestedUsers = filteredUsers.slice(0,5);

        suggestedUsers.forEach((user: IUser) => {
            user.password = "";
        });

        res.status(200).json(suggestedUsers);

    } catch (error) {
        
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
            console.log(error);
        }

    }

}
// ? GET USER SUGGESTIONS ? \\



// ? FOLLOW OR UNFOLLOW A USER ? \\
export const FollowOrUnfollowAUser = async (req: Request, res: Response) => {

    try {
        
        const id = req.params.id;

        const UserToFollowOrUnFollow:IUser | null = await User.findById(id);

        const CurrentUser:IUser | null = await User.findById(req.user?._id);

        // ? check if user is trying to follow himself-herself ? \\
        if(id === req.user?._id.toString()){
            return res.status(400).json({ error: "You Can Only Follow or Unfollow Other Users !" });
        }

        if(!UserToFollowOrUnFollow || !CurrentUser){
            return res.status(400).json({ error: "User Not Found !" });
        }

        const IsFollowing:boolean = CurrentUser.following.some(followingId => followingId.toString() === id);

        if(IsFollowing){
        
            // ? if you are already following , unfollow user ? \\
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user?._id } });
            await User.findByIdAndUpdate(req.user?._id, { $pull: { following: id } });

            // ? TODO => return the id of the user as a response ? \\

            res.status(200).json({ message: "User Unfollowed Successfully !" });
        
        }else{
        
            // ? if you are not following , follow user ? \\
            await User.findByIdAndUpdate(id, { $push: { followers: req.user?._id } });
            await User.findByIdAndUpdate(req.user?._id, { $push: { following: id } });

            // ? create notification ? \\
            const newNotification = new Notification({
                from: req.user?._id,
                to: UserToFollowOrUnFollow?._id,
                type: "follow",
            });

            await newNotification.save();

            res.status(200).json({ message: "User Followed Successfully !" });
        
        }

    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    }

}
// ? FOLLOW OR UNFOLLOW A USER ? \\



// ? UPDATE USER ? \\
export const UpdateUser = async (req: Request, res: Response) => {

    const {fullName,email,bio,link,username,currentPassword,newPassword } = req.body;

    let { profileImg, coverImg } = req.body;

    const userId = req.user?._id;

    try {
    
        const user:IUser | null = await User.findById(userId);

        if(!user){
            return res.status(400).json({ error: "User Not Found !" });
        }

        if((!newPassword && currentPassword) || (!currentPassword && newPassword)){
            return res.status(400).json({ error: "Please Provide Both Current Password and New Password !" });
        }

        if(currentPassword && newPassword){
            const IsMatch = bcryptjs.compare(currentPassword,user?.password);

            if(!IsMatch){
                return res.status(400).json({ error: "Current Password Is Incorrect !" });
            }
            if(newPassword.length < 6){
                return res.status(400).json({ error: "New Password Must Be At Least 6 Characters !" });
            }
        
            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(newPassword,salt);
        
        }

        if(profileImg){

            if(user?.profileImg){
                const publicId = user.profileImg.split("/").pop()?.split(".")[0];
                if (publicId) {
                    await Cloudinary.uploader.destroy(publicId);
                }
            }

            const UploadedProfileImg = await Cloudinary.uploader.upload(profileImg,{
                folder: "profileImgs",
                width: 500,
                height: 500,
                crop: "fill",
                gravity: "center",
            });

            profileImg = UploadedProfileImg.secure_url;

        }

        if(coverImg){

            if(user?.coverImg){
                const publicId = user.coverImg.split("/").pop()?.split(".")[0];
                if (publicId) {
                    await Cloudinary.uploader.destroy(publicId);
                }
            }
            
            const UploadedCoverImg = await Cloudinary.uploader.upload(coverImg,{
                folder: "coverImgs",
                width: 1000,
                height: 500,
                crop: "fill",
                gravity: "center",
            });

            coverImg = UploadedCoverImg.secure_url;

        }

        user.fullName = fullName || user?.fullName;
        user.email = email || user?.email;
        user.bio = bio || user?.bio;
        user.link = link || user?.link;
        user.profileImg = profileImg || user?.profileImg;
        user.coverImg = coverImg || user?.coverImg;
        user.username = username || user?.username;

        await user.save();

        // ? remove password from response ? \\
        user.password = "";

        res.status(200).json(user);


    } catch (error) {
        
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    
    }

}
// ? UPDATE USER ? \\

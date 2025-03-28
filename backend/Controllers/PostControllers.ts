import { Request, Response } from 'express';
import Post, { IPost } from '../Models/PostModel';
import User, { IUser } from '../Models/UserModel';
import Cloudinary from '../Cloudinary/Cloudinary';
import { Types } from 'mongoose';
import Notification from '../Models/NotificationModel';

// ? GET ALL POSTS ? \\
export const GetAllPosts = async (req: Request, res: Response) => {

    try {
        
        const posts : IPost[] = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "username fullName profileImg coverImg bio link -password",
        }).populate({
            path: "comments.user",
            select: "username fullName profileImg coverImg bio link -password",
        });

        if(posts.length === 0){
            return res.status(200).json([]);
        }

        res.status(200).json(posts);

    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    }

}
// ? GET ALL POSTS ? \\



// ? GET FOLLOWING POSTS ? \\
export const GetFollowingPosts = async (req: Request, res: Response) => {

    try {
        
        const userId = req.user?._id

        const user : IUser | null = await User.findById(userId);

        if(!user){
            return res.status(400).json({ error: "User Not Found !" });
        }

        const following = user?.following;

        const PostsToFeed : IPost[] = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "username fullName profileImg coverImg bio link -password",
        }).populate({
            path: "comments.user",
            select: "username fullName profileImg coverImg bio link -password",
        });

        res.status(200).json(PostsToFeed);

    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    }

}
// ? GET FOLLOWING POSTS ? \\



// ? GET LIKED POSTS ? \\
export const GetLikedPosts = async (req: Request, res: Response) => {

    const userId = req.params.id;

    try {
        
        const user = await User.findById(userId).select("likedPosts");

        if(!user){
            return res.status(400).json({ error: "User Not Found !" });
        }

        const LikedPosts = await Post.find({ _id: { $in: user.likedPosts } }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "username fullName profileImg coverImg bio link -password",
        }).populate({
            path: "comments.user",
            select: "username fullName profileImg coverImg bio link -password",
        });

        res.status(200).json(LikedPosts);

    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    }

}
// ? GET LIKED POSTS ? \\



// ? GET USER POSTS ? \\
export const GetUserPosts = async (req: Request, res: Response) => {

    try {
        
        const {username} = req.params;

        const user : IUser | null = await User.findOne({ username: username }).select("_id");

        if(!user){
            return res.status(400).json({ error: "User Not Found !" });
        }

        const UserPostsToGet : IPost[] = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "username fullName profileImg coverImg bio link -password",
        }).populate({
            path: "comments.user",
            select: "username fullName profileImg coverImg bio link -password",
        });

        res.status(200).json(UserPostsToGet);

    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    }

}
// ? GET USER POSTS ? \\



// ? CREATE POST ? \\
export const CreatePost = async (req: Request, res: Response) => {

    try {

        const {text} = req.body;

        let {img} = req.body;
    
        const userId = req?.user?._id.toString();
    
        const user = await User.findById(userId);
    
        if(!user){
            return res.status(400).json({ error: "User Not Found !" });
        }

        if(!text && !img){
            return res.status(400).json({ error: "Please Provide Text or Image For Your Post !" });
        }

        if(img){
            const UploadedImg = await Cloudinary.uploader.upload(img,{
                folder: "postImgs",
                width: 1000,
                height: 1000,
                crop: "fill",
                gravity: "center",
            });

            img = UploadedImg.secure_url;
        }

        const newPost : IPost | null = new Post({
            user: userId,
            text,
            img,
        });

        await newPost.save();

        res.status(201).json(newPost);

    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    }

}
// ? CREATE POST ? \\



// ? LIKE OR UNLIKE POST ? \\
export const LikeUnlikePost = async (req: Request, res: Response) => {

    try {
        
        const userId = req.user?._id;

        const {id:postId} = req.params;

        const post : IPost | null = await Post.findById(postId);

        if(!post){
            return res.status(400).json({ error: "Post Not Found !" });
        }

        if (!userId) {
            return res.status(401).json({ error: "User Not Authenticated!" });
        }

        const IfUserLikedPost: boolean = post.likes.includes(new Types.ObjectId(userId));

        if(IfUserLikedPost){
            // ? remove user from likes array if user already liked the post ? \\

            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
        
            res.status(200).json({ message: "Post Unliked Successfully!" });
        
        }else{
            // ? add user to likes array if user did not like the post ? \\

            await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });

            // ? create notification ? \\
            const newNotification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            });

            await newNotification.save();
        
            res.status(200).json({ message: "Post Liked Successfully !" });
        }

    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    }

}
// ? LIKE OR UNLIKE POST ? \\



// ? COMMENT ON POST ? \\
export const CommentOnPost = async (req: Request, res: Response) => {
    
    try {

        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user?._id;

        if (!text) {
            return res.status(400).json({ error: "You Need To Write Something In Comment!" });
        }

        if (!userId) {
            return res.status(401).json({ error: "User Not Authenticated!" });
        }

        const post: IPost | null = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({ error: "Post Not Found!" });
        }

        const comment = { user: new Types.ObjectId(userId), text };

        post.comments.push(comment);

        await post.save();

        res.status(200).json(post);
    
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    }
};
// ? COMMENT ON POST ? \\



// ? DELETE POST ? \\
export const DeletePost = async (req: Request, res: Response) => {

    try {
        
        const post : IPost | null = await Post.findById(req.params.id);

        if(!post){
            return res.status(400).json({ error: "Post Not Found !" });
        }

        // ? check if user is trying to delete a post that is not his-hers ? \\
        if(post.user.toString() !== req.user?._id.toString()){
            return res.status(400).json({ error: "You Can Only Delete Your Own Posts !" });
        }

        // ? delete post image from cloudinary if post has image ? \\
        if(post.img){
            const publicId = post.img.split("/").pop()?.split(".")[0];
            if (publicId) {
                await Cloudinary.uploader.destroy(publicId);
            }
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Post Deleted Successfully !" });

    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    }

}
// ? DELETE POST ? \\

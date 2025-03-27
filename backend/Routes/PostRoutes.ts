import express from 'express';
import { ProtectedRoute } from '../Middlewares/ProtectedRoute';
import { GetAllPosts, GetFollowingPosts, GetLikedPosts, GetUserPosts, CreatePost, LikeUnlikePost, CommentOnPost, DeletePost } from '../Controllers/PostControllers';


const PostRoutes : express.Router = express.Router();


PostRoutes.get('/allPosts',ProtectedRoute,GetAllPosts);
PostRoutes.get("/followingPosts", ProtectedRoute, GetFollowingPosts);
PostRoutes.get("/likes/:id", ProtectedRoute, GetLikedPosts);
PostRoutes.get("/user/:username", ProtectedRoute, GetUserPosts);
PostRoutes.post("/createPost", ProtectedRoute, CreatePost);
PostRoutes.post("/like/:id", ProtectedRoute, LikeUnlikePost);
PostRoutes.post("/comment/:id", ProtectedRoute, CommentOnPost);
PostRoutes.delete("/:id", ProtectedRoute, DeletePost);



export default PostRoutes;
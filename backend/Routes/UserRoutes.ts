import express, { Request, Response } from 'express';
import { ProtectedRoute } from '../Middlewares/ProtectedRoute';
import { FollowOrUnfollowAUser, GetUserProfile, GetUserSuggestions,UpdateUser } from '../Controllers/UserControllers';



const UserRoutes : express.Router = express.Router();



UserRoutes.get('/profile/:username',ProtectedRoute,GetUserProfile)
UserRoutes.get('/suggestedUsers',ProtectedRoute,GetUserSuggestions)
UserRoutes.post('/followUser/:id',ProtectedRoute,FollowOrUnfollowAUser)
UserRoutes.post('/updateProfile',ProtectedRoute,UpdateUser)




export default UserRoutes;
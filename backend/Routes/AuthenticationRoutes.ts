import express, { Request, Response } from 'express';
import { Register, Login, LogOut, GetAuthenticatedUser } from '../Controllers/AuthenticationControllers';
import { ProtectedRoute } from '../Middlewares/ProtectedRoute';

const AuthenticationRoutes : express.Router = express.Router();


AuthenticationRoutes.post('/register', Register);
AuthenticationRoutes.post('/login', Login);
AuthenticationRoutes.post('/logout', LogOut);
AuthenticationRoutes.get('/getUser', ProtectedRoute ,GetAuthenticatedUser);


export default AuthenticationRoutes;
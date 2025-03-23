import express, { Request, Response } from 'express';
import { Register, Login, LogOut } from '../Controllers/AuthenticationControllers';

const AuthenticationRoutes : express.Router = express.Router();


AuthenticationRoutes.post('/register', Register);
AuthenticationRoutes.post('/login', Login);
AuthenticationRoutes.post('/logout', LogOut);


export default AuthenticationRoutes;
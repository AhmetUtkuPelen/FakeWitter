import express from 'express';
import { ProtectedRoute } from '../Middlewares/ProtectedRoute';
import { GetNotifications,DeleteNotifications,DeleteNotification } from '../Controllers/NotificationControllers';



const NotificationsRoutes : express.Router = express.Router();


NotificationsRoutes.get('/getNotifications',ProtectedRoute,GetNotifications)
NotificationsRoutes.delete('/deleteNotifications',ProtectedRoute,DeleteNotifications)
NotificationsRoutes.delete('/deleteNotification/:id',ProtectedRoute,DeleteNotification)



export default NotificationsRoutes;
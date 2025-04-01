import { Request, Response } from 'express';
import Notification, { INotification } from '../Models/NotificationModel';



// ? GET NOTIFICATIONS ? \\
export const GetNotifications = async (req: Request, res: Response) => {

    try {
        
        const userId = req.user?._id;

        const Notifications : INotification[] = await Notification.find({to : userId}).populate({
            path: "from",
            select: "username fullName profileImg",
        }).sort({ createdAt: -1 });

        await Notification.updateMany({to : userId}, {read : true});

        res.status(200).json(Notifications);

    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    }

}
// ? GET NOTIFICATIONS ? \\



// ? DELETE NOTIFICATIONS ? \\
export const DeleteNotifications = async (req: Request, res: Response) => {

    try {
        
        const userId = req.user?._id;

        await Notification.deleteMany({to : userId});

        res.status(200).json({ message: "Notifications Deleted Successfully !" });

    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    }

}
// ? DELETE NOTIFICATIONS ? \\



// ? DELETE NOTIFICATION ? \\
export const DeleteNotification = async (req: Request, res: Response) => {

    try {
        
        const notificationId = req.params.id;

        const userId = req.user?._id;

        const notification : INotification | null = await Notification.findById(notificationId)

        if(!notification){
            return res.status(400).json({ error: "Notification Not Found !" });
        }

        if(notification?.to.toString() !== userId?.toString()){
            return res.status(403).json({ error: "You Can Only Delete Notifications That Are For You !" });
        }

        await Notification.findByIdAndDelete(notificationId);

        res.status(200).json({ message: "Notification Deleted Successfully !" });

    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    }

}
// ? DELETE NOTIFICATION ? \\

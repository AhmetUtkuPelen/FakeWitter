import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import AuthenticationRoutes from './Routes/AuthenticationRoutes';
import UserRoutes from './Routes/UserRoutes';
import PostRoutes from './Routes/PostRoutes';
import NotificationsRoutes from './Routes/NotificationsRoutes';
import { ConnectDatabase } from './DataBase/DataBase';



// ? Load environment variables ? \\
dotenv.config();
// ? Load environment variables ? \\



const app = express();
const PORT = process.env.PORT;



// ? Middlewares ? \\
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
// ? Middlewares ? \\



// ? Routes ? \\
app.use('/api/auth', AuthenticationRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/post', PostRoutes);
app.use('/api/notification', NotificationsRoutes);
// ? Routes ? \\



// ? Connect to database ? \\
ConnectDatabase();
// ? Connect to database ? \\



// ? Start server ? \\
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
// ? Start server ? \\
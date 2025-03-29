import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import AuthenticationRoutes from './Routes/AuthenticationRoutes';
import { ConnectDatabase } from './DataBase/DataBase';
import UserRoutes from './Routes/UserRoutes';
import PostRoutes from './Routes/PostRoutes';
import NotificationsRoutes from './Routes/NotificationsRoutes';



// ? Config .env ? \\
dotenv.config();
// ? Config .env ? \\



const app = express();



// ? Port ? \\
const PORT = process.env.PORT;
// ? Port ? \\



// ? Middlewares ? \\
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());
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
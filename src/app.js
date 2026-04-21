// import './config.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', userRoutes);

app.use(errorMiddleware);

export default app;
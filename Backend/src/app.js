import cookieParser from 'cookie-parser';
import express from 'express'
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';

const app=express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    credentials:true,
    methods:['GET','POST','PUT','DELETE'],
    origin:"http://localhost:5173"
}));
app.use('/api/auth',authRouter);

export default app;
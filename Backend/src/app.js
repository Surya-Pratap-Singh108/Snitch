import cookieParser from 'cookie-parser';
import express from 'express'
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';
import passport from 'passport';
import {Strategy as GoogleStrategy} from  'passport-google-oauth20';
import config from './config/config.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';

const app=express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    origin: [
        "http://localhost:5173",
        /\.vercel\.app$/ 
    ]
}));
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.NODE_ENV === 'development' 
        ? 'http://localhost:3000/api/auth/google/callback'
        : 'https://snitch-backend-slt6.onrender.com/api/auth/google/callback' // ✅
},(accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}))

app.use('/api/auth',authRouter);
app.use('/api/products',productRouter);
app.use('/api/cart',cartRouter);

export default app;
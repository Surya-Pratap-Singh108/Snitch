import cookieParser from 'cookie-parser';
import express from 'express'
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';
import passport from 'passport';
import {Strategy as GoogleStrategy} from  'passport-google-oauth20';
import config from './config/config.js';

const app=express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors({
//     credentials:true,
//     methods:['GET','POST','PUT','DELETE'],
//     origin:"http://localhost:5173"
// }));
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID:config.GOOGLE_CLIENT_ID,
    clientSecret:config.GOOGLE_CLIENT_SECRET,
    callbackURL:'/api/auth/google/callback'
},(accessToken,refreshToken,profile,done)=>{
    return done(null,profile);
}))

app.use('/api/auth',authRouter);

export default app;
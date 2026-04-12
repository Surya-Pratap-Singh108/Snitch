import {Router} from 'express';
import { validateRegisterUser,validateLoginUser } from '../validator/auth.validator.js';
import { register,login, googleCallback } from '../controllers/auth.controllers.js';
import passport from 'passport';
import config from '../config/config.js';

const authRouter=Router();

authRouter.post('/register',validateRegisterUser,register);

authRouter.post('/login',validateLoginUser,login);

authRouter.get('/google',
    passport.authenticate('google',{scope:['profile','email']}));

authRouter.get('/google/callback',
    passport.authenticate('google',{session:false,failureRedirect:config.NODE_ENV === 'development' ?  'http://localhost:5173/login' :'/login'}),googleCallback);

export default authRouter;
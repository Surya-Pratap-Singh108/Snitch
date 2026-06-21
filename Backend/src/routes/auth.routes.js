import {Router} from 'express';
import { validateRegisterUser,validateLoginUser } from '../validator/auth.validator.js';
import { register, login, googleCallback, getMe, verifyEmail } from '../controllers/auth.controllers.js'; 
import passport from 'passport';
import config from '../config/config.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { logout } from '../controllers/auth.controllers.js';

const authRouter=Router();

authRouter.post('/register',validateRegisterUser,register);
authRouter.post('/verify-email',verifyEmail);
authRouter.post('/login',validateLoginUser,login);

authRouter.get('/google',
    passport.authenticate('google',{scope:['profile','email']}));

authRouter.get('/google/callback',
    passport.authenticate('google',{
   session:false,failureRedirect:
 config.NODE_ENV === 'development'
 ? 'http://localhost:5173/login'
 : 'https://snitch-tawny.vercel.app/login'
}),googleCallback);

authRouter.get('/me',authenticateUser,getMe);

authRouter.post('/logout', logout); 

export default authRouter;
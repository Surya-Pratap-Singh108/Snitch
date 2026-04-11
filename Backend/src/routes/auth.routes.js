import {Router} from 'express';
import { validateRegisterUser,validateLoginUser } from '../validator/auth.validator.js';
import { register,login, googleCallback } from '../controllers/auth.controllers.js';
import passport from 'passport';

const authRouter=Router();

authRouter.post('/register',validateRegisterUser,register);

authRouter.post('/login',validateLoginUser,login);

authRouter.get('/google',
    passport.authenticate('google',{scope:['profile','email']}));

authRouter.get('/google/callback',
    passport.authenticate('google',{session:false}),googleCallback);

export default authRouter;
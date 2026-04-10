import {Router} from 'express';
import { validateRegisterUser,validateLoginUser } from '../validator/auth.validator.js';
import { register,login } from '../controllers/auth.controllers.js';


const authRouter=Router();

authRouter.post('/register',validateRegisterUser,register);
authRouter.post('/login',validateLoginUser,login);

export default authRouter;
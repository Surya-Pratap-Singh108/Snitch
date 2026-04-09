import {Router} from 'express';
import { validateRegisterUser } from '../validator/auth.validator.js';
import { register } from '../controllers/auth.controllers.js';


const authRouter=Router();

authRouter.post('/register',validateRegisterUser,register);

export default authRouter;
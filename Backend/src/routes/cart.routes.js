import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateIncrementCartItemQuantity, validateToCart } from '../validator/cart.validator.js';
import {  addToCart, getCart, incrementCartItemQuantity } from '../controllers/cart.controller.js';

const cartRouter=express.Router();

cartRouter.post('/add/:productId/:variantId',authenticateUser,validateToCart,addToCart)


cartRouter.get('/',authenticateUser,getCart);

cartRouter.patch('/quantity/increment/:productId/:variantId',authenticateUser,validateIncrementCartItemQuantity,incrementCartItemQuantity)


export default cartRouter;
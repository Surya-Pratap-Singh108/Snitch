import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateCartItemQuantity,  validateFromCart,  validateToCart } from '../validator/cart.validator.js';
import {  addToCart, createOrderController, decrementCartItemQuantity, getCart, incrementCartItemQuantity, removeFromCart, verifyOrderController } from '../controllers/cart.controller.js';

const cartRouter=express.Router();

cartRouter.post('/add/:productId/:variantId',authenticateUser,validateToCart,addToCart)

cartRouter.delete('/remove/:productId/:variantId',authenticateUser,validateFromCart,removeFromCart)


cartRouter.get('/',authenticateUser,getCart);

cartRouter.patch('/quantity/increment/:productId/:variantId',authenticateUser,validateCartItemQuantity,incrementCartItemQuantity)

cartRouter.patch('/quantity/decrement/:productId/:variantId',authenticateUser,validateCartItemQuantity,decrementCartItemQuantity)

cartRouter.post('/payment/create/order',authenticateUser,createOrderController)

cartRouter.post('/payment/verify/order',authenticateUser,verifyOrderController)


export default cartRouter;
import mongoose from "mongoose";
import { stockOfVariant } from "../dao/product.dao.js";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import config from "../config/config.js";

export  const addToCart=async(req,res)=>{
    const{productId,variantId}=req.params;
    const {quantity=1}=req.body;
    const product=await productModel.findOne({
        _id:productId,
        "variants._id":variantId,
    })
    if(!product){
        return res.status(404).json({
            message:'Product not found!',
            success:false,
        });
    }
    
    const stock=await stockOfVariant(productId,variantId);

    const cart=(await cartModel.findOne({user:req.user._id}))
        ||(await cartModel.create({user:req.user._id}));

    const isProductAlreadyInCart=cart.items.some(item=>item.product.toString()===productId && item.variant?.toString()===variantId);

    if(isProductAlreadyInCart){
        const qnantityInCart=cart.items.find(item=>item.product.toString()===productId && item.variant?.toString()===variantId).quantity;
        if(qnantityInCart+quantity>stock){
            return res.status(400).json({
            message:`Only ${stock} items left in stock and you already have ${qnantityInCart} item in your cart`,
            success:false,
        });
        }
        await cartModel.findOneAndUpdate(
            {
                user: req.user._id,
                "items.product": productId,
                "items.variant": variantId
            },
            {
                $inc: { "items.$.quantity": quantity }//update quantity of the matched item inside items.
            },
            {
                new: true//Return updated document after change.
            }
        );
        // Find matching cart item inside array → $ points to that item → $inc increases its quantity → return updated cart.
        return res.status(200).json({
            message:'Cart updated successfully!',
            success:true,
        });
    }
    if(quantity>stock){
         return res.status(400).json({
            message:`Only ${stock} items left in stock`,
            success:false,
        });
    }

    cart.items.push({
        product:productId,
        variant:variantId,
        quantity,
        price: product.variants.find(
            v => v._id.toString() === variantId
            )?.price || product.price,
    })
    await cart.save();
     return res.status(200).json({
            message:'Product added to cart successfully',
            success:true,
        });

}

export  const removeFromCart=async(req,res)=>{
    const{productId,variantId}=req.params;
    const product=await productModel.findOne({
        _id:productId,
        "variants._id":variantId,
    })
    if(!product){
        return res.status(404).json({
            message:'Product not found!',
            success:false,
        });
    }
    

    const cart=(await cartModel.findOne({user:req.user._id}))
    if (!cart) {
        return res.status(404).json({
            message: "Cart not found!",
            success: false,
        });
    }

    cart.items.pull({
        product: productId,
        variant: variantId,
        });

    await cart.save();
     return res.status(200).json({
            message:'Product removed from cart successfully',
            success:true,
        });

}

export  const getCart=async(req,res)=>{

    const user=req.user;

    let cart=await getCartDetails(user._id);
    
    if(!cart){
        cart=await cartModel.create({user:user._id})
    }

    return res.status(200).json({
        message:"Cart fetched successfully!",
        success:true,
        cart
    })
}

export  const incrementCartItemQuantity=async(req,res)=>{
    const{productId,variantId}=req.params;
    
    const product=await productModel.findOne({
        _id:productId,
        "variants._id":variantId,
    })
    if(!product){
        return res.status(404).json({
            message:'Product not found!',
            success:false,
        });
    }
    const cart=(await cartModel.findOne({user:req.user._id}));
    if(!cart){
        return res.status(404).json({
            message:'Cart not found!',
            success:false,
        });
    }
    const stock=await stockOfVariant(productId,variantId);
    const itemQuantityInCart=cart.items.find(item=>item.product.toString()===productId && item.variant?.toString()===variantId)?.quantity||0;
   
    if(itemQuantityInCart+1>stock){
        return res.status(400).json({
            message:`Only ${stock} items left in stock and you already have ${itemQuantityInCart} item in your cart`,
            success:false,
        })
    }

    await cartModel.findOneAndUpdate(
            {
                user: req.user._id,
                "items.product": productId,
                "items.variant": variantId
            },
            {
                $inc: { "items.$.quantity": 1 }//update quantity of the matched item inside items.
            },
            {
                new: true//Return updated document after change.
            }
        )

    return res.status(200).json({
            message:`Cart item quantity incremented successfully`,
            success:true,
        })

}


export  const decrementCartItemQuantity=async(req,res)=>{
    const{productId,variantId}=req.params;
    
    const product=await productModel.findOne({
        _id:productId,
        "variants._id":variantId,
    })
    if(!product){
        return res.status(404).json({
            message:'Product not found!',
            success:false,
        });
    }
    const cart=(await cartModel.findOne({user:req.user._id}));
    if(!cart){
        return res.status(404).json({
            message:'Cart not found!',
            success:false,
        });
    }
    const itemQuantityInCart=cart.items.find(item=>item.product.toString()===productId && item.variant?.toString()===variantId)?.quantity||0;

    if(itemQuantityInCart===1){
        return res.status(400).json({
            message:`You have minimum quantity in your cart Please remove it if you want`,
            success:false,
        })
    }

    await cartModel.findOneAndUpdate(
            {
                user: req.user._id,
                "items.product": productId,
                "items.variant": variantId
            },
            {
                $inc: { "items.$.quantity": -1 }//update quantity of the matched item inside items.
            },
            {
                new: true//Return updated document after change.
            }
        )

    return res.status(200).json({
            message:`Cart item quantity decremented successfully`,
            success:true,
        })

}

export  const createOrderController=async(req,res)=>{
    
    const cart=await getCartDetails(req.user._id);
      if(!cart){
         return res.status(400).json({
            message:`Cart is empty`,
            success:false,
         })
    }

    const order=await createOrder({amount:cart.TotalPrice,currency:cart.currency});

    const payment=await paymentModel.create({
        user:req.user._id,
        razorpay:{
        orderId:order.id,
        },
        price:{
            amount:cart.TotalPrice,
            currency:cart.currency,
        },
        orderItems:cart.items.map(item=>({
            title:item.product.title,
            productId:item.product._id,
            variantId:item.variant,
            quantity:item.quantity,
            images:item.product.variants.images||item.product.images,
            description:item.product.description,
            price:{
                amount:item.product.variants.price.amount||item.product.price.amount,
                currency:item.product.variants.price.currency||item.product.price.currency,
            },
        })),
});
    return res.status(200).json({
            message:`Order created Successfully`,
            success:true,
            order
        })
}

export const verifyOrderController=async(req,res)=>{
    const {razorpayPaymentId, razorpayOrderId, razorpaySignature}=req.body;
    const payment=await paymentModel.findOne({
        "razorpay.orderId":razorpayOrderId,
        status:"pending",
    });

    if(!payment){
        return res.status(400).json({
            message:'Payment not found!',
            success:false,
        })
    }

    const isPaymentValid=validatePaymentVerification({//true or false
        order_id: razorpayOrderId,
        payment_id: razorpayPaymentId,
    },razorpaySignature,config.RAZORPAY_KEY_SECRET);
    
    if(!isPaymentValid){
        payment.status="failed";
        await payment.save();
        return res.status(400).json({
            message:'Payment verification failed!',
            success:false,
        })
    }

    payment.status="paid";

    payment.razorpay.paymentId=razorpayPaymentId;

    payment.razorpay.signature=razorpaySignature;

    await payment.save();
    return res.status(200).json({
        message:'Payment verified and order placed successfully!',
        success:true,
    })
}
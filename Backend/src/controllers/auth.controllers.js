import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import config from '../config/config.js'

async function sendTokenResponse(user,req){
    const token=jwt.sign({
        id:user._id,
    },config.JWT_SECRET);
    
    return token;
}


export const register=async (req,res)=>{
   const {email,contact,password,fullname}=req.body;

   try{
    const existingUser=await userModel.findOne({
        $or:[{email},{contact}],
    })
    if(existingUser){
        res.status(400).json({
        message:'User with this email or contact already exists!',
        })
    }
    const user=await userModel.create({
        email,
        contact,
        password,
        fullname
    })
    
    const token=sendTokenResponse(user,req);
    
    res.status(201).json({
        message:'User register Successfully',
        user:{
            username:user.username,
            email:user.email,
            role:user.role,
        }
    })
   }catch(error){
    console.log(error);
    res.status(500).json({message:"Server Error!"});
   }

   
}
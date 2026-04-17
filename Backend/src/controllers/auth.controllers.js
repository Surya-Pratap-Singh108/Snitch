import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

function sendTokenResponse(user, res,message) {
    const token = jwt.sign(
        {
            id: user._id,
        },
        config.JWT_SECRET,
        { expiresIn: "7d" },
    );
    res.cookie('token',token);
     res.status(201).json({
            message,
            success:true,
            user: {
                id:user._id,
                fullname: user.fullname,
                contact: user.contact,
                email: user.email,
                role: user.role
            },
        });
}

export const register = async (req, res) => {
    const { email, contact, password, fullname,isSeller } = req.body;
    const isSellerBool = isSeller === true || isSeller === "true";
    try {
        const existingUser = await userModel.findOne({
            $or: [{ email }, { contact }],
        });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email or contact already exists!",
            });
        }
        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
            role: isSellerBool ? "seller" : "buyer"
        });

        sendTokenResponse(user, res,"User Registered successfully!");

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error!" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
   try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "User not exists!",
            });
        }
       const isMatch=await user.comparePassword(password);
       if(!isMatch){
        return res.status(400).json({
                message: "Incorrect Password!",
            });
       }
        sendTokenResponse(user, res,"User Login successfully!");

   }
   catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error!" });
    }
};

export const googleCallback = async (req, res) =>{
    const { id,displayName,emails,photos } = req.user;
    try{const email = emails[0].value;
    const profileImage = photos[0].value;
    let user=await userModel.findOne({email});
        if(!user){
            user=await userModel.create({
                email,
                fullname:displayName,
                googleId:id,
            });
        }
    const token = jwt.sign(
        {
            id: user._id,
        },
        config.JWT_SECRET,
        { expiresIn: "7d" },
    );
    res.cookie('token',token);
    
    res.redirect('http://localhost:5173/');
    }
   catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error!" });
    }
}

export const getMe=async (req,res)=>{
    const user=req.user;

    res.status(200).json({
        message:"User fetch successfully",
        success:true,
        user:{
            id:user._id,
            email:user.email,
            fullname:user.fullname,
            contact:user.contact,
            role:user.role,
        }
    })

}


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
                role: isSeller?"seller":"buyer"
            },
        });
}

export const register = async (req, res) => {
    const { email, contact, password, fullname,isSeller } = req.body;

    try {
        const existingUser = await userModel.findOne({
            $or: [{ email }, { contact }],
        });
        if (existingUser) {
            res.status(400).json({
                message: "User with this email or contact already exists!",
            });
        }
        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
        });

        sendTokenResponse(user, res,"User Registered successfully!");

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error!" });
    }
};

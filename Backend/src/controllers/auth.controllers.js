import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { sendEmail } from "../services/mail.service.js"; // ✅ added

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

function sendTokenResponse(user, res, message) {
    const token = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: "7d" },
    );
    res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000
});
    res.status(201).json({
        message,
        success: true,
        user: {
            id: user._id,
            fullname: user.fullname,
            contact: user.contact,
            email: user.email,
            role: user.role
        },
    });
}

export const register = async (req, res) => {
    const { email, contact, password, fullname, isSeller } = req.body;
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
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
            role: isSellerBool ? "seller" : "buyer",
            otp,          
            otpExpiry,    
        });

        await sendEmail({
            to: email,
            subject: 'Verify your Snitch account',
            html: `<h2>Welcome to Snitch!</h2><p>Your OTP is:</p><h1 style="color:#6366f1">${otp}</h1><p>Valid for 10 minutes.</p>`
        });

        res.status(201).json({
            message: "OTP sent to your email. Please verify to continue!",
            success: true,
            userId: user._id,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error!" });
    }
};

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    try {
        const user = await userModel.findById(userId);
         console.log("Received OTP:", otp, typeof otp);           // ✅ phir log karo
        console.log("Stored OTP:", user?.otp, typeof user?.otp);
        if (!user) return res.status(400).json({ message: "User not found!" });
        if (user.isVerified) return res.status(400).json({ message: "Already verified!" });
        if (user.otp !== String(otp))  return res.status(400).json({ message: "Invalid OTP!" });
        if (user.otpExpiry < new Date()) return res.status(400).json({ message: "OTP expired!" });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        sendTokenResponse(user, res, "Email verified! Welcome to Snitch 🎉");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error!" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not exists!" });

        if (!user.isVerified) return res.status(400).json({ message: "Please verify your email first!" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect Password!" });

        sendTokenResponse(user, res, "User Login successfully!");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error!" });
    }
};


export const googleCallback = async (req, res) => {
    const { id, displayName, emails, photos } = req.user;
    try {
        const email = emails[0].value;
        const profileImage = photos[0].value;
        let user = await userModel.findOne({ email });
        if (!user) {
            user = await userModel.create({
                email,
                fullname: displayName,
                googleId: id,
                isVerified: true,
            });
        }
        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "7d" });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.redirect(config.NODE_ENV === 'development'
            ? 'http://localhost:5173/'
            : 'https://snitch-tawny.vercel.app/');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error!" });
    }
};

export const getMe = async (req, res) => {
    const user = req.user;
    res.status(200).json({
        message: "User fetch successfully",
        success: true,
        user: {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            contact: user.contact,
            role: user.role,
        }
    });
};
import { generateToken } from "../lib/utils.mjs";
import User from "../models/User.mjs";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/Cloudinary.mjs";

//sgn-up user
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;
    try {
        //check if user already exists
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Details are missing" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "Account already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            email,
            fullName,
            password: hashedPassword,
            bio
        });

        const token = generateToken(newUser._id);
        res.json({ success: true, userData: newUser, token, message: "Account created successfully" });


    }
    catch (error) {
        console.error("Error sign-up:", error);
        res.json({ success: false, message: "Server Error" });
    }
};

//controller for login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const token = generateToken(userData._id);
        res.json({ success: true, userData, token, message: "Login successfully" });


    }
    catch (error) {
        console.error("Error login:", error);
        res.json({ success: false, message: error.message });
    }
}
//controller to check user authenticte
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
}
//controller to update user profile
export const updateProfile = async (req, res) => {
    try {
        const { profilepic, bio, fullName } = req.body;
        const userId = req.user._id;
        let updatedUser;
        if (!profilepic) {
            console.log("hii kjnj")
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
        }
        else {
            const upload = await cloudinary.uploader.upload(profilepic);
             console.log(" kjnj")
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName, profilepic: upload.secure_url }, { new: true });
        }
        res.json({ success: true, user: updatedUser, message: "Profile updated successfully" });
    }
    catch (error) {
        console.log("Error update profile:", error);
        res.json({ success: false, message: error.message });

    }
}
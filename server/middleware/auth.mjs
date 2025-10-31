import User from "../MODELS/User.mjs";
import jwt from "jsonwebtoken";


//midddleware to protect routes
export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        req.user = user;
        next();

    }
    catch (error) {
        console.error("Error in auth middleware:", error.message);
        res.json({ success: false, message: error.message });
    }
}


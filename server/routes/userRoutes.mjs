import express from 'express';
import { checkAuth, login, signup, updateProfile } from '../controllers/userController.mjs';
import { protectRoute } from '../middleware/auth.mjs';
const userRouter = express.Router();
userRouter.post("/signup",signup);
userRouter.post("/login",login);
userRouter.put("/update-profile",protectRoute,updateProfile);
userRouter.get("/check-auth",protectRoute,checkAuth);

export default userRouter;
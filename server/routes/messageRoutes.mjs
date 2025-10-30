import express from 'express';
import { protectRoute } from '../middleware/auth.mjs';
import { getMessages, getUserSlidebar, markMessagesAsSeen, sendMessage } from '../controllers/messagecontrollers.mjs';
const messageRouter = express.Router();
messageRouter.get("/users",protectRoute,getUserSlidebar)
messageRouter.get("/:id",protectRoute,getMessages)
messageRouter.put("/mark/:id",protectRoute,markMessagesAsSeen)
messageRouter.post("/send/:id",protectRoute,sendMessage)

export default messageRouter;


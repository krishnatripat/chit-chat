import Message from "../MODELS/message.mjs";
import User from "../models/User.mjs";
import { io, userSocketMap } from "../index.mjs";
import cloudinary from "../lib/Cloudinary.mjs";
//get all user expert logged in user    
export const getUserSlidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id, receiverId: userId, seen: false
            })
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }

        })
        await Promise.all(promises);
        res.json({ success: true, users: filteredUsers, unseenMessages });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });


    }


}
//get all messages gor selected user
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        })
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });
        res.json({ success: true, messages });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
//api to mark messages as seen
export const markMessagesAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//send message TO SELECTED USERS
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;

        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
//emit the new message to receiver 
const receiverSocketId=userSocketMap[receiverId];
 if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage",newMessage);
 }  
        res.json({ success: true, message: newMessage });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
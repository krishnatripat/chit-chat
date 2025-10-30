import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./authcontext";
import toast from "react-hot-toast";

export const chatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setmessages] = useState([])
    const [users, setusers] = useState([])
    const [selectedUser, setselectedUser] = useState(null)
    const [unseenMessages, setunseenMessages] = useState({})
    const { socket, axios } = useContext(AuthContext);





    //function to all user slidebar
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)
            if (data.success) {
                setmessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }

    }
    //function to send message to selected user


    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData)
            if (data.success) {
                setmessages((prevMessages) => [...prevMessages, data.newMessage])

            }
            else {
                toast.error(data.message)
            }
        } catch (error) {

            toast.error(error.message)
        }
    }
    //function to subscribe to messages for selected user   
    const subscribeToMessages = async () => {
        if (!socket) return;
        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setmessages((prevMessages) => [...prevMessages, newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            else {
                setunseenMessages((prevUnseenMessages) => ({

                    ...prevUnseenMessages, [newMessage.senderId]:
                        prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    //function to unbsubscribe new messages
    const unbsubscribeFromMessages = () => {
        if (socket) socket.off("new Messages");
    }
    useEffect(() => {
        subscribeToMessages();
        return () => unbsubscribeFromMessages();
    }, [socket, selectedUser])

    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {

                setusers(data.users)
                setunseenMessages(data.unseenMessages)

            }
        } catch (error) {
            toast.error(error.message)

        }
    }

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setselectedUser,
        unseenMessages,
        setunseenMessages

    }
    return (
        <chatContext.Provider value={value}>
            {children}
        </chatContext.Provider>
    )
}
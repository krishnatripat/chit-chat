import React, { useEffect, useRef } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { useContext } from 'react'
import { chatContext } from '../../context/chatContext'
import { AuthContext } from '../../context/authcontext'
import { useState } from 'react'
import toast from 'react-hot-toast'

const Chatcontainer = () => {

    const { messages, setselectedUser, selectedUser, sendMessage, getMessages } = useContext(chatContext)
    const { authUser, onlineUsers } = useContext(AuthContext)
    const scrollEnd = useRef()
    const [input, setInput] = useState("");
    //handle send messages
    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (input.trim() === "") return null;
        await sendMessage({ text: input.trim() });
        setInput("")
    }
    //handle send an image 

    const handleSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("select an image")
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            await sendMessage({ image: reader.result })
            e.target.value = ""
        }
        reader.readAsDataURL(file)
    }




    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id)
        }
    }, [selectedUser, messages])
    useEffect(() => {
        if (scrollEnd.current && messages) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" });

        }
    }, [messages])
    return selectedUser ? (
        <div className='h-full overflow-scroll relative backdrop-blur-lg'>
            {/* header area */}
            <div className='flex items-center gap-3 py3 mx-4 border-b border-stone-500 '
                >
                <img

                    src={selectedUser.profilepic || assets.avatar_icon} alt="" className='w-8 rounded-full' />

                <p className='flex-1 text-lg text-white flex items-center gap-2'>
                    {selectedUser.fullName}
                    {onlineUsers.includes(selectedUser._id) &&
                        <span className='w-2 h-2 rounded-full bg-green-500'></span>}
                </p>
                <img onClick={() => setselectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
                <img src={assets.help_icon} className='max-md:hidden text-white max-w-5' alt="" />
            </div>
            {/* chat area */}
            <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll pb-6 p-3'>

                {messages.map((msg, index) => (

                    <div key={index} className={`flex items-end gap-2 justify-end  
                    ${msg?.senderId !== authUser._id && 'flex-row-reverse'}`}>

                        {msg?.image ? (
                            <img src={msg?.image}
                                className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' alt="" />
                        ) : (
                            <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white 
                                ${msg?.senderId !== authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg?.text}</p>
                        )}
                        <div className='text-center text-xs'>
                            <img src={msg?.senderId === authUser._id ? authUser?.profilepic || assets.avatar_icon
                                : selectedUser.profilepic || assets.avatar_icon}
                                className='w-7 rounded-full' alt="" />
                            <p className='text-gray-500'>{formatMessageTime(msg?.createdAt)}</p>
                        </div>
                    </div>
                ))}
                <div className='' ref={scrollEnd}> </div>
            </div>
            {/* input area */}
            <div className='absolute bottom  bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
                <div className='flex-1 flex items-center  bg-gray-100/12 px-3 rounded-full'>
                    <input type="text" onChange={(e) => setInput(e.target.value)} value={input}
                        onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null} placeholder='Enter a Message'
                        className='flex-1 text-sm p-3 border-none  rounded-lg  outline-none text-white placeholder:gray-400' />
                    <input type="file" id='image' hidden onChange={handleSendImage} accept='image/png, image/jpg, image/jpeg' />
                    <label htmlFor="image">
                        <img src={assets.gallery_icon} className='w-5 mr-2 cursor-pointer' alt="" />
                    </label>
                </div>
                <img src={assets.send_button} onClick={handleSendMessage} className='w-7 cursor-pointer' alt="" />
            </div>
        </div>
    ) :
        (<div className='flex flex-col justify-center items-center h-full gap-2 text-gray-500 bg-white/10 max-md:hidden'>
            <img src={assets.logo_icon} className='max-w-16' alt="" />
            <p className='text-lg font-medium text-white'> chat anytime , anywhere</p>
        </div>)
}

export default Chatcontainer
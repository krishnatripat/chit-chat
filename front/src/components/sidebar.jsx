import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authcontext'
import { chatContext } from '../../context/chatContext'

const Sidebar = () => {
    const { getUsers, users, unseenMessages,setunseenMessages, selectedUser, setselectedUser } = useContext(chatContext);
    const { logout, onlineUsers } = useContext(AuthContext)
    const navigate = useNavigate();
    const [input, setInput] = useState(false)


    useEffect(() => { getUsers() }, [])
    const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;
    return (
        <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white 
        ${selectedUser ? 'max-md:hidden' : ''} `}>
            <div className='pb-5'>

                <div className='flex justify-between items-center'>
                    <img src={assets.logo} alt="logo" className='max-w-40' />
                    <div className=' relative py-2 group'>

                        <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
                        <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142]
                         border border-gray-600 text-gray-100 hidden group-hover:block'>
                            <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit profile</p>
                            <hr className='my-2 border-t border-gray-500' />

                            <p onClick={() => logout()} className='cursor-pointer text-sm'>Logout</p>
                        </div>
                    </div>
                </div>
                <div className='bg-[#282142] rounded-full items-center flex gap px-4 py-3 mt-5 '>
                    <img src={assets.search_icon} alt="Search" className='w-3' />
                    <input onChange={(e) => setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none
                     text-white text-xs placeholder:-[#c8c8c8] flex-1 ' placeholder='search user..' />
                </div>
            </div>
            <div className='flex flex-col '>
                {filteredUsers.map((user, index) => (
                    <div onClick={() => { setselectedUser(user); setunseenMessages(prev=>({...prev,[user._id ]:0})) }} key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded  cursor-pointer max-sm:text-sm] ${selectedUser?._id === user._id && 'bg-[#282142]/50'} `}>
                        <img src={user?.profilepic || assets.avatar_icon} alt="profile" className='w-[35px] aspect-[1/1] rounded-full ' />
                        <div className='flex flex-col leading-5'>
                            <p>{user.fullName}   </p>
                            {
                                onlineUsers.includes(String(user._id))

                                    ?
                                    <span className='text-xs text-green-400'>Online</span>
                                    :
                                    <span className='text-xs text-gray-400'>Offline</span>
                            }
                           
                        </div>
                        {unseenMessages[user._id] > 0 &&
                            <p className='absolute top-4 right-4 text-sl h-5 w-5 flex justify-center 
                         items-center rounded-full bg-violet-500/50'>{unseenMessages[user._id]}
                            </p>}

                    </div>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
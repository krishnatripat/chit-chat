import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/authcontext'
const Profilepage = () => {

    const { authUser, updateProfile } = useContext(AuthContext)
    const [name, setname] = useState(authUser.fullName)
    const [bio, setbio] = useState(authUser.bio)
    const [selectedImage, setselectedImage] = useState(null)

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedImage) {
            await updateProfile({ fullName: name, bio });
            navigate('/')
            return
        }
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onload = async () => {
            const base64Image = reader.result;
            await updateProfile({ profilepic: base64Image, fullName: name, bio })
            navigate('/');
            return
        }

    }
    return (
        <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
            <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 
            flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
                <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1' >
                    <h3 className='text-lg'>krishna app</h3>
                    <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
                        <input onChange={(e) => setselectedImage(e.target.files[0])} type="file" id="avatar" accept='.jpg,.png,.jpeg' hidden />
                        <img src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon}
                            className={`w-12 h-12 ${selectedImage && 'rounded-full'}`} alt="" />
                        upload profile image
                    </label>
                    <input type="text" onChange={(e) => setname(e.target.value)} value={name}
                        className='p-2 border border-gray-500 rounded-md focus-outline-none 
                    focus:ring-2 focus:ring-violet-500' required placeholder='Your Name' />

                    <textarea name="" onChange={(e) => setbio(e.target.value)} value={bio}
                        className='border p-2 border-gray-500 rounded-md focus-outline-none focus:ring-2 focus:ring-violet-500'
                        required rows={4} placeholder='Write Profile bio...' id=""></textarea>
                    <button type="submit"
                        className='py-3 bg-gradient-to-r from-purple-400 to-violet-900 text-white rounded-full cursor-pointer'>Save</button>
                </form>

                <img src={ authUser?.profilepic|| assets.logo_icon} className={`max-w-44 aspect-square rounded-full mx-10 max-sm:-mt-10 
                    ${selectedImage && 'rounded-full'} `} alt="" />

            </div>
        </div>
    )
}

export default Profilepage
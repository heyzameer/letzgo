
import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CaptainDetails = () => {
    const navigate = useNavigate();
    // Logout handler
    const handleLogout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/api/captains/logout`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (err) {
            // ignore error, proceed to logout anyway
        }
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    const { captain } = useContext(CaptainDataContext)

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    {/* <img className='h-10 w-10 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" /> */}
                    <h4 className='text-lg font-medium capitalize'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                    <i
                        className="ri-logout-box-line text-2xl absolute right-6  cursor-pointer "
                        style={{ color: '#222' }}
                        onClick={handleLogout}
                    ></i>
                    <i
                        className="ri-profile-line text-2xl absolute right-18 cursor-pointer"
                        style={{ color: '#222' }}
                        onClick={() => navigate('/captain-profile')}
                    ></i>
                </div>
                <div>
                </div>
            </div>
            <div className='flex p-9 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-medium'>200km</h5>
                    <p className='text-sm text-gray-600'>Distance Travlled</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>₹800</h5>
                    <p className='text-sm text-gray-600'>Earned</p>
                </div>

            </div>
        </div>
    )
}

export default CaptainDetails
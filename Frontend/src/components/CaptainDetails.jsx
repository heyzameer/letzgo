
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
        navigate('/captain-login', { replace: true });
    };

    const { captain } = useContext(CaptainDataContext)

    return (
        <div >
            <div className='flex items-center justify-between w-[910px]'>
                <div className='flex items-center gap-4'>
                 
                    {/* Captain Name */}
                    <h4 className='text-lg font-medium capitalize'>
                        {captain.fullname.firstname + " " + captain.fullname.lastname}
                    </h4>

                    {/* Icons side by side */}
                    <div className='flex gap-3 ml-6'>
                        <i
                            className="ri-profile-line text-2xl cursor-pointer"
                            style={{ color: '#222' }}
                            onClick={() => navigate('/captain-profile')}
                        ></i>
                        <i
                            className="ri-logout-box-line text-2xl cursor-pointer"
                            style={{ color: '#222' }}
                            onClick={handleLogout}
                        ></i>
                    </div>
                </div>

                {/* Right section (optional, currently empty) */}
                <div></div>
            </div>
            <div className='flex p-9 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>{captain?.totalRides || 0}</h5>
                    <p className='text-sm text-gray-600'>Rides</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-medium'>{captain?.totalDistance ? (captain.totalDistance / 1000).toFixed(1) : 0} km</h5>
                    <p className='text-sm text-gray-600'>Distance Travlled</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>₹{captain?.totalEarnings || 0}</h5>
                    <p className='text-sm text-gray-600'>Earned</p>
                </div>

            </div>
        </div>
    )
}

export default CaptainDetails
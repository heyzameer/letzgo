import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
    const [ otp, setOtp ] = useState('')
    const [ error, setError ] = useState('');
    const [ isStarting, setIsStarting ] = useState(false);
    const navigate = useNavigate()

    const submitHander = async (e) => {
        e.preventDefault()
        setError('');
        setIsStarting(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/ride/start-ride`, {
                params: {
                    rideId: props.ride._id,
                    otp: otp
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200) {
                props.setConfirmRidePopupPanel(false)
                props.setRidePopupPanel(false)
                navigate('/captain-riding', { state: { ride: props.ride } })
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Invalid OTP or server error.');
        } finally {
            setIsStarting(false);
        }
    }

    return (
        <div className='p-6 font-sans'>
            {/* Header */}
            <div className='flex items-center justify-between mb-10'>
                <div>
                    <h3 className='text-2xl font-black text-slate-900 tracking-tight'>Confirm Pickup</h3>
                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1'>Enter passenger OTP to start</p>
                </div>
                <button 
                    onClick={() => props.setConfirmRidePopupPanel(false)}
                    className='w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100 transition-all'
                >
                    <i className="ri-arrow-down-s-line text-2xl"></i>
                </button>
            </div>

            {/* Passenger ID Card */}
            <div className='bg-slate-900 rounded-[32px] p-6 mb-8 flex items-center justify-between relative overflow-hidden'>
                <div className='flex items-center gap-5 relative z-10'>
                    <div className='w-14 h-14 bg-white/10 rounded-[22px] flex items-center justify-center border border-white/10'>
                        <i className="ri-user-smile-fill text-white text-3xl"></i>
                    </div>
                    <div>
                        <h2 className='text-xl font-black text-white leading-tight capitalize'>
                            {props.ride?.user.fullName.firstName}
                        </h2>
                        <div className='flex items-center gap-2 mt-1'>
                            <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full' />
                            <p className='text-[10px] font-bold text-white/40 uppercase tracking-widest'>At Pickup Point</p>
                        </div>
                    </div>
                </div>
                <div className='text-right relative z-10'>
                    <p className='text-[10px] font-black text-white/20 uppercase tracking-widest mb-0.5'>Fare Estimate</p>
                    <h5 className='text-2xl font-black text-emerald-400 tracking-tighter'>₹{props.ride?.fare}</h5>
                </div>
                {/* Abstract Glow */}
                <div className='absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl' />
            </div>

            {/* Form Section */}
            <div className='mt-8'>
                <form onSubmit={submitHander} className='space-y-8'>
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <i className="ri-error-warning-fill text-lg"></i>
                            {error}
                        </div>
                    )}
                    
                    <div className='relative'>
                        <div className='flex items-center justify-between mb-3 px-1'>
                            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Verification Code</label>
                            <span className='text-[10px] font-black text-emerald-600 uppercase tracking-widest'>Ask Passenger</span>
                        </div>
                        <input 
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value)} 
                            type="text" 
                            className='w-full bg-slate-50 px-6 py-6 font-black text-4xl tracking-[0.4em] text-center rounded-[28px] border-2 border-slate-100 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-slate-900 placeholder:text-slate-200' 
                            placeholder='0000' 
                            maxLength={4}
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-4'>
                        <button 
                            disabled={isStarting}
                            className={`w-full py-5 rounded-[24px] font-black text-sm tracking-[0.2em] uppercase transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3 ${isStarting ? 'bg-slate-100 text-slate-400' : 'bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700'}`}
                        >
                            {isStarting ? (
                                <>
                                    <div className='w-5 h-5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin' />
                                    <span>Starting Ride...</span>
                                </>
                            ) : (
                                <>
                                    <span>Verify & Start Ride</span>
                                    <i className="ri-steering-2-fill text-lg"></i>
                                </>
                            )}
                        </button>
                        
                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    await axios.post(
                                        `${import.meta.env.VITE_BASE_URL}/api/ride/cancel-by-captain`,
                                        { rideId: props.ride._id },
                                        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                                    );
                                    props.setConfirmRidePopupPanel(false)
                                    props.setRidePopupPanel(false)
                                } catch (err) {
                                    setError('Failed to cancel ride');
                                }
                            }}
                            className='w-full bg-slate-100 text-slate-500 font-black py-5 rounded-[24px] hover:bg-red-50 hover:text-red-600 transition-all text-xs uppercase tracking-widest border border-transparent hover:border-red-100'
                        >
                            Unable to Pickup? Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp
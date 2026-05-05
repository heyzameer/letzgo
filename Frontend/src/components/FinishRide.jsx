import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'

const FinishRide = (props) => {
    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)
    const [isPaid, setIsPaid] = useState(false)

    useEffect(() => {
        socket.on('payment-success', (data) => {
            if (data.rideId === props.ride?._id) {
                setIsPaid(true)
            }
        })
        return () => socket.off('payment-success')
    }, [socket, props.ride?._id])

    async function endRide() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/ride/end-ride`, {
                rideId: props.ride._id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200) {
                navigate('/captain-home')
            }
        } catch (error) {
            console.error('Failed to end ride:', error)
        }
    }

    return (
        <div className='p-8'>
            <div className='flex items-center justify-between mb-10'>
                <h3 className='text-2xl font-black text-slate-900 tracking-tight'>Trip Finished</h3>
                <button 
                    onClick={() => props.setFinishRidePanel(false)}
                    className='w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors'
                >
                    <i className="ri-arrow-down-s-line text-2xl"></i>
                </button>
            </div>

            <div className='bg-slate-900 rounded-[40px] p-8 mb-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20'>
                <div className='absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] -mr-24 -mt-24' />
                
                <div className='flex items-center justify-between relative z-10'>
                    <div className='flex items-center gap-5'>
                        <div className='w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center backdrop-blur-md border border-white/10'>
                            <i className="ri-user-heart-fill text-emerald-400 text-3xl"></i>
                        </div>
                        <div>
                            <h2 className='text-xl font-black tracking-tight leading-tight capitalize'>
                                {props.ride?.user.fullName.firstName} {props.ride?.user.fullName.lastName}
                            </h2>
                            <div className='flex items-center gap-2 mt-1.5'>
                                <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Passenger</span>
                                <div className='w-1 h-1 bg-slate-600 rounded-full' />
                                <span className='text-[10px] font-black text-emerald-400 uppercase tracking-widest'>Verified</span>
                            </div>
                        </div>
                    </div>
                    <div className='text-right'>
                        <h5 className='text-3xl font-black text-emerald-400 tracking-tighter'>₹{props.ride?.fare}</h5>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1'>Total Fare</p>
                    </div>
                </div>
            </div>

            <div className='space-y-4 mb-12'>
                <div className='flex items-start gap-5 p-5 bg-slate-50/50 rounded-3xl border border-transparent hover:border-slate-100 transition-all'>
                    <div className='w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 shrink-0'>
                        <i className="ri-map-pin-user-fill text-xl"></i>
                    </div>
                    <div className='flex-1 overflow-hidden'>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Pickup Location</p>
                        <h3 className='text-sm font-bold text-slate-900 mt-1 line-clamp-1'>{props.ride?.pickup}</h3>
                    </div>
                </div>

                <div className='flex items-start gap-5 p-5 bg-slate-50/50 rounded-3xl border border-transparent hover:border-slate-100 transition-all'>
                    <div className='w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-600 shrink-0'>
                        <i className="ri-map-pin-2-fill text-xl"></i>
                    </div>
                    <div className='flex-1 overflow-hidden'>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Drop-off Location</p>
                        <h3 className='text-sm font-bold text-slate-900 mt-1 line-clamp-1'>{props.ride?.destination}</h3>
                    </div>
                </div>
            </div>

            <div className='space-y-4'>
                <div className={`p-6 rounded-[32px] border flex items-center justify-between transition-all ${isPaid ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'}`}>
                    <div className='flex items-center gap-4'>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPaid ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
                            <i className={isPaid ? "ri-checkbox-circle-line text-xl" : "ri-time-line text-xl"}></i>
                        </div>
                        <div>
                            <h4 className={`text-sm font-black uppercase tracking-widest ${isPaid ? 'text-emerald-700' : 'text-orange-700'}`}>
                                {isPaid ? 'Payment Confirmed' : 'Awaiting Payment'}
                            </h4>
                            <p className='text-[10px] font-bold text-slate-400 mt-0.5 capitalize'>Method: Online (Razorpay)</p>
                        </div>
                    </div>
                    {isPaid && <i className="ri-shield-check-fill text-emerald-600 text-2xl"></i>}
                </div>

                <button
                    onClick={endRide}
                    className='w-full bg-black text-white font-black py-5 rounded-[24px] shadow-2xl shadow-black/20 active:scale-[0.98] transition-all text-sm tracking-[0.2em] flex items-center justify-center gap-3 uppercase'
                >
                    <span>Finish & GO HOME</span>
                    <i className="ri-arrow-right-up-line text-xl"></i>
                </button>
                
                <p className='text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-4'>
                    {isPaid ? 'Payment received successfully' : 'Please ensure payment is collected'}
                </p>
            </div>
        </div>
    )
}

export default FinishRide
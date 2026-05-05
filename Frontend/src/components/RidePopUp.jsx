import React from 'react'

const RidePopUp = (props) => {
    return (
        <div className='p-6 font-sans'>
            {/* Header */}
            <div className='flex items-center justify-between mb-8'>
                <div>
                    <h3 className='text-2xl font-black text-slate-900 tracking-tight'>New Ride Request</h3>
                    <div className='flex items-center gap-2 mt-1'>
                        <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse' />
                        <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Nearby Pickup</span>
                    </div>
                </div>
                <button 
                    onClick={() => props.setRidePopupPanel(false)}
                    className='w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all border border-slate-100'
                >
                    <i className="ri-close-line text-2xl"></i>
                </button>
            </div>

            {/* Passenger Highlight Card */}
            <div className='bg-emerald-500 rounded-[32px] p-6 mb-8 flex items-center justify-between shadow-2xl shadow-emerald-500/30 relative overflow-hidden group cursor-pointer'>
                <div className='flex items-center gap-5 relative z-10'>
                    <div className='w-14 h-14 bg-black/10 rounded-[22px] flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:scale-105 transition-transform'>
                        <i className="ri-user-heart-fill text-black text-3xl"></i>
                    </div>
                    <div>
                        <h2 className='text-xl font-black text-black leading-tight'>
                            {props.ride?.user.fullName.firstName} {props.ride?.user.fullName.lastName}
                        </h2>
                        <div className='flex items-center gap-1.5 mt-1'>
                            <i className="ri-star-fill text-black/40 text-[10px]"></i>
                            <p className='text-xs font-black text-black/60 uppercase tracking-widest'>4.9 Passenger</p>
                        </div>
                    </div>
                </div>
                <div className='text-right relative z-10'>
                    <p className='text-[10px] font-black text-black/40 uppercase tracking-widest mb-0.5'>Fare Est.</p>
                    <h5 className='text-2xl font-black text-black tracking-tighter'>
                        ₹{props.ride?.fare}
                    </h5>
                </div>
                {/* Abstract bg element */}
                <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl' />
            </div>

            {/* Location Details */}
            <div className='bg-slate-50 rounded-[32px] p-4 mb-10 border border-slate-100 space-y-1'>
                <div className='flex items-start gap-4 p-4 rounded-2xl transition-all hover:bg-white'>
                    <div className='w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0'>
                        <i className="ri-map-pin-user-fill text-xl"></i>
                    </div>
                    <div className='min-w-0'>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Pickup Location</p>
                        <h3 className='text-sm font-bold text-slate-900 mt-1 line-clamp-2 leading-snug'>{props.ride?.pickup}</h3>
                    </div>
                </div>

                <div className='flex items-center gap-4 px-8'>
                    <div className='w-px h-6 border-l-2 border-dotted border-slate-200' />
                    <div className='flex-1 h-px bg-slate-100' />
                    <span className='text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-3'>{Math.round((props.ride?.distance || 0) / 1000)}KM</span>
                    <div className='flex-1 h-px bg-slate-100' />
                </div>

                <div className='flex items-start gap-4 p-4 rounded-2xl transition-all hover:bg-white'>
                    <div className='w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0'>
                        <i className="ri-map-pin-2-fill text-xl"></i>
                    </div>
                    <div className='min-w-0'>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Destination</p>
                        <h3 className='text-sm font-bold text-slate-900 mt-1 line-clamp-2 leading-snug'>{props.ride?.destination}</h3>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className='grid grid-cols-2 gap-4'>
                <button 
                    onClick={() => {
                        props.setConfirmRidePopupPanel(true)
                        props.confirmRide()
                    }} 
                    className='bg-black text-white font-black py-5 rounded-[24px] shadow-2xl shadow-black/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group'
                >
                    <span className='tracking-widest uppercase text-sm'>Accept Ride</span>
                    <i className="ri-arrow-right-line text-lg group-hover:translate-x-1 transition-transform"></i>
                </button>

                <button 
                    onClick={() => props.setRidePopupPanel(false)} 
                    className='bg-slate-100 text-slate-500 font-black py-5 rounded-[24px] hover:bg-slate-200 active:scale-[0.98] transition-all text-sm uppercase tracking-widest'
                >
                    Ignore
                </button>
            </div>
        </div>
    )
}

export default RidePopUp
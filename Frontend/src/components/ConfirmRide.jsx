import React from 'react'
import car from '../assets/car.jpg'
import auto from '../assets/auto.jpg'
import bike from '../assets/moto.jpg'

const ConfirmRide = (props) => {
    let vehicleImg = car;
    if (props.vehicleType === 'auto') vehicleImg = auto;
    if (props.vehicleType === 'moto' || props.vehicleType === 'motorcycle' || props.vehicleType === 'bike') vehicleImg = bike;

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between mb-8'>
                <h3 className='text-2xl font-black text-slate-900 tracking-tight'>Confirm Ride</h3>
                <button 
                    onClick={() => props.setConfirmRidePanel(false)}
                    className='w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors'
                >
                    <i className="ri-arrow-down-s-line text-2xl"></i>
                </button>
            </div>

            <div className='flex flex-col items-center'>
                <div className='w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center mb-8 relative'>
                    <div className='absolute inset-0 bg-emerald-500/5 rounded-full animate-pulse' />
                    <img className='h-24 w-auto object-contain relative z-10' src={vehicleImg} alt={props.vehicleType} />
                </div>

                <div className='w-full space-y-1 mb-8'>
                    <div className='flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors'>
                        <div className='w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0'>
                            <i className="ri-map-pin-user-fill text-xl"></i>
                        </div>
                        <div>
                            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Pickup</p>
                            <h3 className='text-sm font-bold text-slate-900 mt-0.5 line-clamp-1'>{props.pickup}</h3>
                        </div>
                    </div>

                    <div className='flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors'>
                        <div className='w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0'>
                            <i className="ri-map-pin-2-fill text-xl"></i>
                        </div>
                        <div>
                            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Destination</p>
                            <h3 className='text-sm font-bold text-slate-900 mt-0.5 line-clamp-1'>{props.destination}</h3>
                        </div>
                    </div>

                    <div className='flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors'>
                        <div className='w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0'>
                            <i className="ri-bank-card-line text-xl"></i>
                        </div>
                        <div>
                            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Total Fare</p>
                            <h3 className='text-xl font-black text-slate-900 mt-0.5'>₹{props.fare[props.vehicleType]}</h3>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => {
                        props.setVehicleFound(true)
                        props.setConfirmRidePanel(false)
                        props.createRide()
                    }} 
                    className='w-full bg-black text-white font-black py-4 rounded-2xl shadow-xl shadow-black/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group'
                >
                    <span>CONFIRM BOOKING</span>
                    <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                </button>

                {props.cancelMessage && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-center text-red-600 font-bold text-xs">
                    {props.cancelMessage}
                  </div>
                )}
            </div>
        </div>
    )
}

export default ConfirmRide
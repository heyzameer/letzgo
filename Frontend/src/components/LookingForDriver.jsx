import React from 'react'
import car from '../assets/car.jpg'
import auto from '../assets/auto.jpg'
import bike from '../assets/moto.jpg'

const LookingForDriver = (props) => {
    let vehicleImg = car;
    if (props.vehicleType === 'auto') vehicleImg = auto;
    if (props.vehicleType === 'moto' || props.vehicleType === 'motorcycle' || props.vehicleType === 'bike') vehicleImg = bike;

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between mb-8'>
                <h3 className='text-2xl font-black text-slate-900 tracking-tight'>Finding Driver</h3>
                <button 
                    onClick={() => props.setVehicleFound(false)}
                    className='w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors'
                >
                    <i className="ri-arrow-down-s-line text-2xl"></i>
                </button>
            </div>

            <div className='flex flex-col items-center'>
                <div className='w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-8'>
                    <div className='h-full bg-black w-1/3 rounded-full animate-[loading_1.5s_infinite_ease-in-out]' />
                </div>

                <div className='w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center mb-8 relative'>
                    <div className='absolute inset-0 border-4 border-slate-200 rounded-full border-t-black animate-spin' />
                    <img className='h-20 w-auto object-contain relative z-10' src={vehicleImg} alt={props.vehicleType} />
                </div>

                <div className='w-full space-y-1 mb-6'>
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
                            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Fare Amount</p>
                            <h3 className='text-xl font-black text-slate-900 mt-0.5'>₹{props.fare[props.vehicleType]}</h3>
                        </div>
                    </div>
                </div>

                <p className='text-xs font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse'>
                    Notifying nearby captains...
                </p>
            </div>

            <style>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
            `}</style>
        </div>
    )
}

export default LookingForDriver
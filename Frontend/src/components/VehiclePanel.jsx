import React from 'react'
import car from '../assets/car.jpg'
import auto from '../assets/auto.jpg'
import bike from '../assets/moto.jpg'

const VehiclePanel = (props) => {
    const vehicles = [
        {
            type: 'car',
            name: 'UberGo',
            image: car,
            capacity: 4,
            time: '2 mins away',
            desc: 'Affordable, compact rides',
            price: props.fare.car
        },
        {
            type: 'moto',
            name: 'Moto',
            image: bike,
            capacity: 1,
            time: '3 mins away',
            desc: 'Quick & affordable motorcycle rides',
            price: props.fare.moto
        },
        {
            type: 'auto',
            name: 'Uber Auto',
            image: auto,
            capacity: 3,
            time: '5 mins away',
            desc: 'Efficient & breezy auto rides',
            price: props.fare.auto
        }
    ];

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between mb-8'>
                <h3 className='text-2xl font-black text-slate-900 tracking-tight'>Choose a vehicle</h3>
                <button 
                    onClick={() => props.setVehiclePanel(false)}
                    className='w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors'
                >
                    <i className="ri-arrow-down-s-line text-2xl"></i>
                </button>
            </div>

            <div className='space-y-4 mb-8'>
                {vehicles.map((v) => (
                    <div 
                        key={v.type}
                        onClick={() => {
                            props.setConfirmRidePanel(true)
                            props.selectVehicle(v.type)
                            props.setVehiclePanel(false)
                        }} 
                        className='group flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-black active:scale-[0.98] transition-all cursor-pointer'
                    >
                        <div className='flex items-center gap-4'>
                            <div className='w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden group-hover:scale-105 transition-transform'>
                                <img className='w-full h-full object-contain' src={v.image} alt={v.name} />
                            </div>
                            <div>
                                <div className='flex items-center gap-2'>
                                    <h4 className='font-bold text-slate-900'>{v.name}</h4>
                                    <span className='flex items-center gap-1 px-1.5 py-0.5 bg-slate-200 rounded text-[10px] font-bold text-slate-600'>
                                        <i className='ri-user-3-fill'></i>{v.capacity}
                                    </span>
                                </div>
                                <p className='text-xs font-bold text-emerald-600 mt-0.5'>{v.time}</p>
                                <p className='text-[10px] font-medium text-slate-500 mt-0.5'>{v.desc}</p>
                            </div>
                        </div>
                        <h2 className='text-xl font-black text-slate-900'>₹{v.price}</h2>
                    </div>
                ))}
            </div>
            
            <p className='text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                Prices may vary based on traffic
            </p>
        </div>
    )
}

export default VehiclePanel


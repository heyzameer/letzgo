import React from 'react'
import car from '../assets/car.jpg'
import auto from '../assets/auto.jpg'
import bike from '../assets/moto.jpg'
import axios from 'axios'

const WaitingForDriver = (props) => {
  let vehicleImg = car;
  const vehicleType = props.ride?.captain?.vehicle?.vehicleType;
  if (vehicleType === 'auto') vehicleImg = auto;
  if (['moto', 'motorcycle', 'bike'].includes(vehicleType)) vehicleImg = bike;

  const handleCancel = async () => {
    if (props.ride?._id) {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ride/cancel-by-user`,
        { rideId: props.ride._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
    }
    props.setWaitingForDriver(false);
  };

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center gap-3'>
          <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
          <h3 className='text-2xl font-black text-slate-900 tracking-tight'>Driver Arriving</h3>
        </div>
        <button 
          onClick={handleCancel}
          className='px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors'
        >
          Cancel
        </button>
      </div>

      <div className='bg-slate-900 rounded-[32px] p-6 mb-8 text-white relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16' />
        
        <div className='flex items-center justify-between relative z-10'>
          <div className='flex items-center gap-4'>
            <div className='w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10'>
              <img className='w-12 h-12 object-contain' src={vehicleImg} alt={vehicleType} />
            </div>
            <div>
              <h2 className='text-lg font-black tracking-tight leading-tight'>
                {props.ride?.captain.fullname.firstname} {props.ride?.captain.fullname.lastname}
              </h2>
              <p className='text-xs font-bold text-slate-400 uppercase tracking-widest mt-1'>
                {props.ride?.captain.vehicle.plate} • {vehicleType}
              </p>
            </div>
          </div>
          <div className='text-right'>
            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>Share OTP</p>
            <div className='bg-emerald-500 text-black font-black px-3 py-1.5 rounded-xl text-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]'>
              {props.ride?.otp}
            </div>
          </div>
        </div>
      </div>

      <div className='space-y-1 mb-2'>
        <div className='flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors'>
          <div className='w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0'>
            <i className="ri-map-pin-user-fill text-xl"></i>
          </div>
          <div>
            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Pickup</p>
            <h3 className='text-sm font-bold text-slate-900 mt-0.5 line-clamp-1'>{props.ride?.pickup}</h3>
          </div>
        </div>

        <div className='flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors'>
          <div className='w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0'>
            <i className="ri-map-pin-2-fill text-xl"></i>
          </div>
          <div>
            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Destination</p>
            <h3 className='text-sm font-bold text-slate-900 mt-0.5 line-clamp-1'>{props.ride?.destination}</h3>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-3 gap-3 px-2'>
        <div className='bg-slate-50 p-3 rounded-2xl border border-slate-100'>
          <p className='text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1'>Fare</p>
          <p className='text-sm font-black text-slate-900'>₹{props.ride?.fare}</p>
        </div>
        <div className='bg-slate-50 p-3 rounded-2xl border border-slate-100'>
          <p className='text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1'>Distance</p>
          <p className='text-sm font-black text-slate-900'>{Math.round((props.ride?.distance || 0) / 1000)} Km</p>
        </div>
        <div className='bg-slate-50 p-3 rounded-2xl border border-slate-100'>
          <p className='text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1'>Duration</p>
          <p className='text-sm font-black text-slate-900'>{Math.round((props.ride?.duration || 0) / 60)} Min</p>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver
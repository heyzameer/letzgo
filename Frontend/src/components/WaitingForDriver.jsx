import React from 'react'
import car from '../assets/car.jpg'
import auto from '../assets/auto.jpg'
import bike from '../assets/moto.jpg'
import axios from 'axios' // <-- Add this import

const WaitingForDriver = (props) => {
  // Select image based on vehicleType
  let vehicleImg = car;
  if (props.ride?.captain?.vehicle?.vehicleType === 'auto') vehicleImg = auto;
  if (
    props.ride?.captain?.vehicle?.vehicleType === 'moto' ||
    props.ride?.captain?.vehicle?.vehicleType === 'motorcycle' ||
    props.ride?.captain?.vehicle?.vehicleType === 'bike'
  ) vehicleImg = bike;

  return (
    <div>
      <h5
        className='p-1 text-center w-[93%] absolute top-0'
        onClick={async () => {
          // Send cancel ride request to backend
          console.log("Cancelling ride with ID:", props.ride?._id);
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
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
        <span className="block text-xs text-gray-200 ">Double click to cancel ride</span>
      </h5>

      <div className='flex items-center justify-between'>
        <img className='h-12' src={vehicleImg} alt={props.ride?.captain?.vehicle?.vehicleType} />
        <div className='text-right p-4'>
          <h2 className='text-lg font-medium capitalize'>{props.ride?.captain.fullname.firstname + " " + props.ride?.captain.fullname.lastname}</h2>
          <h4 className='text-xl font-semibold -mt-1 -mb-1'>{props.ride?.captain.vehicle.plate}</h4>
          <p className='text-sm text-gray-600'>{props.ride?.captain.vehicle.vehicleType}</p>
          <h1 className='text-lg font-semibold'> OTP - {props.ride?.otp} </h1>
        </div>
      </div>

      <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full mt-5'>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>Pickup</h3>
              <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>Destination</h3>
              <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="ri-currency-line"></i>
            <div>
              <h3 className='text-lg font-medium'>Fare </h3>
              <p className='text-sm -mt-1 text-gray-600'>₹{props.ride?.fare}</p>
            </div>

          </div>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="ri-currency-line"></i>
            <div>
              <h3 className='text-lg font-medium'>Distance </h3>
              <p className='text-sm -mt-1 text-gray-600'>{Math.round((props.ride?.distance) / 1000)} Km</p>
            </div>

          </div>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="ri-currency-line"></i>
            <div>
              <h3 className='text-lg font-medium'>Duration </h3>
              <p className='text-sm -mt-1 text-gray-600'>{Math.round((props.ride?.duration) / 60)} Hours</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver
import React from 'react'
import { Link,useLocation } from 'react-router-dom'
import { useEffect,useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Riding = () => {
  const location = useLocation();
  const ride = location.state?.ride;
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  socket.on('ride-ended', (data) => {
    console.log("Ride finished:", data);
    navigate('/home');
  });


  return (
    <div className='h-screen'>
      <Link to={'/home'} className='fixed h-10 w-10 bg-white flex items-center justify-center rounded-full top-5 left-5 shadow-md'>
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>
      <div className='h-1/2'>

      <LiveTracking/>
        {/* <img
          src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif'
          alt="Background"
          className='w-full h-full object-cover'
        /> */}
      </div>
      <div className='h-1/2 p-4'>
        <div className='flex items-center justify-between'>
          <img className='h-12' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
          <div className='text-right'>
            <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname + " "+ ride?.captain.fullname.lastname}</h2>
            <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
            <p className='text-sm text-gray-600'>{ride?.captain.vehicle.vehicleType}</p>
            {/* <h1 className='text-lg font-semibold'> otp </h1> */}
          </div>
        </div>

        <div className='flex gap-2 justify-between flex-col items-center'>
          <div className='w-full mt-5'>

            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>Destination</h3>
                <p className='text-sm -mt-1 text-gray-600'>{ride?.destination}</p>
              </div>
            </div>
            <div className='flex items-center gap-5 p-3'>
              <i className="ri-currency-line"></i>
              <div>
                <h3 className='text-lg font-medium'>Fare </h3>
                <p className='text-sm -mt-1 text-gray-600'>₹{ride?.fare}</p>
              </div>
            </div>
          </div>
        </div>
        <button className='w-full  bg-green-600 text-white font-semibold p-2 rounded-lg'>Make a Payment</button>
      </div>
    </div>
  )
}

export default Riding

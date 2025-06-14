import React from 'react'
import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import { useContext } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import LiveTracking from '../components/LiveTracking'


const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false)
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)

  const ridePopupPanelRef = useRef(null)
  const confirmRidePopupPanelRef = useRef(null)
  const [ride, setRide] = useState(null)

  const { socket } = useContext(SocketContext)
  const { captain } = useContext(CaptainDataContext)

  useEffect(() => {
    console.log("Captain complete data:", captain);
    socket.emit('join', { userType: "captain", userId: captain?._id });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {

          console.log("Updating location for captain:", captain._id, position.coords.latitude, position.coords.longitude);
          socket.emit('update-location-captain', {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        })
      }
    }

    const locationInterval = setInterval(updateLocation, 10000)
    updateLocation()
    // return () => {
    //   clearInterval(locationInterval)
    // }

  }, [])

  socket.on('new-ride', (data) => {
    console.log("New ride received:", data);
    setRide(data)
    setRidePopupPanel(true)
    setConfirmRidePopupPanel(false)
  })


 async function confirmRide() {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/ride/confirm`, {
      rideId: ride._id,
      captainId: captain._id,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    console.log("req sent from captain fro ride")

    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);

  } catch (error) {
    console.error('Error confirming ride:', error?.response?.data?.message || error.message);
    alert('Failed to confirm ride. Please try again.');
  }
}


  useGSAP(function () {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(ridePopupPanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [ridePopupPanel])

  useGSAP(function () {
    if (confirmRidePopupPanel) {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [confirmRidePopupPanel])


  return (
    <div className='h-screen pt-10    '>
      <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
        <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
        {/* <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link> */}
      </div>
      <div className='h-3/5'>
        <LiveTracking />
      </div>


      <div className='h-2/5 p-6 w-[910px]'>
        <CaptainDetails 
        captain={captain}
        ridePopupPanel={ridePopupPanel}
        confirmRidePopupPanel={confirmRidePopupPanel}/>
      </div>
      <div ref={ridePopupPanelRef} className='fixed w-[910px] z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      <div ref={confirmRidePopupPanelRef} className='fixed w-[910px] h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
      </div>


    </div>
  )
}

export default CaptainHome

import React, { useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'
import axios from 'axios'
import NavigationMap from '../components/NavigationMap'

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride

    // State for current (captain) location from backend
    const [currentCoords, setCurrentCoords] = useState(null);

    // Get destination coordinates from rideData
    const destinationCoords = rideData?.destinationLocation
        ? { lat: rideData.destinationLocation.ltd, lng: rideData.destinationLocation.lng }
        : null;

    // Fetch current coordinates from backend API every 5 seconds
    useEffect(() => {
        let intervalId;
        const fetchCurrentCoords = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/api/ride/current-coordinates`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                if (res.data && typeof res.data.lat === 'number' && typeof res.data.lng === 'number') {
                    setCurrentCoords({ lat: res.data.lat, lng: res.data.lng });
                }
            } catch (err) {
                // Optionally handle error
            }
        };
        fetchCurrentCoords();
        intervalId = setInterval(fetchCurrentCoords, 500000);
        return () => clearInterval(intervalId);
    }, []);

    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [finishRidePanel])
    console.log("Ride data in CaptainRiding:", rideData);

    return (
        <div className='h-screen'>
            {/* Map at the top */}
            <div className='w-full' style={{ height: '79%' }}>
                {currentCoords && destinationCoords ? (
                    <NavigationMap origin={currentCoords} destination={destinationCoords} />
                ) : (
                    <LiveTracking />
                )}
            </div>

            {/* Complete Ride panel at the bottom */}
            <div className='w-full flex-1 flex flex-col justify-end'>
                <div
                    className='h-55 p-6 flex items-center justify-between relative bg-yellow-400 pt-10 cursor-pointer'
                    onClick={() => setFinishRidePanel(true)}
                >
                    <h5 className='p-1 text-center w-[90%] absolute top-0'>
                        <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
                    </h5>
                    <h4 className='text-xl font-semibold'>{rideData?.distance ? `${(rideData.distance / 1000).toFixed(1)} KM away` : 'Ride in progress'}</h4>
                    {!finishRidePanel && (<button className='bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete Ride</button>
)}
                </div>
            </div>

            {/* Finish Ride popup panel */}
            <div
                ref={finishRidePanelRef}
                className='fixed z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12'
            >
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel}
                />
            </div>
        </div>
    )
}

export default CaptainRiding
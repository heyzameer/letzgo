import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride

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

    return (
        <div className='h-screen'>
            {/* Map at the top */}
            <div className='w-full' style={{ height: '79%' }}>
                <LiveTracking />
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
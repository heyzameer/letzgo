import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'
import axios from 'axios'
import NavigationMap from '../components/NavigationMap'

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const [isPaid, setIsPaid] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride
    const { socket } = useContext(SocketContext)

    useEffect(() => {
        socket.on('payment-success', (data) => {
            if (data.rideId === rideData?._id) {
                setIsPaid(true)
            }
        })
        return () => socket.off('payment-success')
    }, [socket, rideData?._id])

    const [currentCoords, setCurrentCoords] = useState(null);
    const destinationCoords = rideData?.destinationLocation
        ? { lat: rideData.destinationLocation.ltd, lng: rideData.destinationLocation.lng }
        : null;

    useEffect(() => {
        const fetchCurrentCoords = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/ride/current-coordinates-captain`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.data && res.data.lat) setCurrentCoords({ lat: res.data.lat, lng: res.data.lng });
            } catch (err) {}
        };
        fetchCurrentCoords();
        const intervalId = setInterval(fetchCurrentCoords, 10000);
        return () => clearInterval(intervalId);
    }, []);

    useGSAP(() => {
        if (finishRidePanelRef.current) {
            gsap.to(finishRidePanelRef.current, {
                y: finishRidePanel ? '0%' : '100%',
                duration: 0.6,
                ease: 'power4.out'
            });
        }
    }, [finishRidePanel]);

    return (
        <div className='h-screen relative overflow-hidden bg-slate-50 font-sans'>
            <div className='h-screen w-full z-0'>
                {currentCoords && destinationCoords ? (
                    <NavigationMap origin={currentCoords} destination={destinationCoords} />
                ) : (
                    <LiveTracking />
                )}
            </div>

            <div className='fixed bottom-0 left-0 right-0 z-10 p-6 pointer-events-none'>
                <div 
                    onClick={() => setFinishRidePanel(true)}
                    className='pointer-events-auto bg-emerald-500 rounded-[32px] p-6 shadow-2xl shadow-emerald-500/30 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all group'
                >
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center backdrop-blur-sm'>
                            <i className="ri-map-pin-2-fill text-black text-2xl group-hover:scale-110 transition-transform"></i>
                        </div>
                        <div>
                            <h4 className='text-lg font-black text-black leading-tight'>
                                {rideData?.distance ? `${(rideData.distance / 1000).toFixed(1)} KM` : 'On Trip'}
                            </h4>
                            <p className='text-xs font-bold text-black/60 uppercase tracking-widest'>Distance Left</p>
                        </div>
                    </div>
                    
                    <button className='bg-black text-white px-6 py-3 rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-black/20'>
                        FINISH RIDE
                    </button>
                </div>
            </div>

            <div
                ref={finishRidePanelRef}
                className='fixed inset-x-0 bottom-0 z-30 bg-white rounded-t-[40px] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.2)] translate-y-full'
            >
                <div className='w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4' />
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel}
                />
            </div>
        </div>
    )
}

export default CaptainRiding
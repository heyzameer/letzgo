import React, { useEffect, useState } from 'react'
import axios from 'axios'

const UserRideHistoryPanel = ({ open, setOpen }) => {
    const [rides, setRides] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (open) {
            setLoading(true)
            setError('')
            axios.get(`${import.meta.env.VITE_BASE_URL}/api/ride/user/history`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    // Filter out rides with status 'pending'
                    const filtered = res.data.filter(ride => ride.status == 'completed' || ride.status == 'cancelled');
                    setRides(filtered)
                    setLoading(false)
                })
                .catch(err => {
                    setError('Failed to fetch ride history')
                    setLoading(false)
                })
        }
    }, [open])

    return (
        <div className={`fixed z-50 top-0 right-0 w-full max-w-[910px] h-full bg-white shadow-lg transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold">Your Ride History</h2>
                <i
                    className="ri-close-line text-2xl cursor-pointer"
                    onClick={() => setOpen(false)}
                ></i>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
                {loading && <div>Loading...</div>}
                {error && <div className="text-red-600">{error}</div>}
                {!loading && !error && rides.length === 0 && (
                    <div className="text-gray-500 text-center mt-10">No rides found.</div>
                )}
                {!loading && !error && rides.length > 0 && (
                    <div className="space-y-4">
                        {rides.map(ride => (
                            <div key={ride._id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-lg">{ride.pickup} → {ride.destination}</span>
                                    <span className={`text-xs px-2 py-1 rounded ${ride.status === 'completed' ? 'bg-green-100 text-green-700' : ride.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {ride.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                                    <div>Fare: <span className="font-semibold">₹{ride.fare}</span></div>
                                    <div>Distance: <span className="font-semibold">{ride.distance ? (ride.distance / 1000).toFixed(1) : '-'} km</span></div>
                                    <div>Duration: <span className="font-semibold">{ride.duration ? Math.round(ride.duration / 60) : '-'} min</span></div>
                                    <div>Booking ID: <span className="font-mono">{ride._id}</span></div>
                                    <div>Date: <span>{ride.rideDate ? new Date(ride.rideDate).toLocaleString() : (ride.createdAt ? new Date(ride.createdAt).toLocaleString() : '-')}</span></div>
                                </div>
                                {ride.captain && (
                                    <div className="mt-2 text-xs text-gray-600">
                                        Captain: {ride.captain.fullname?.firstname} {ride.captain.fullname?.lastname} | Vehicle: {ride.captain.vehicle?.vehicleType} ({ride.captain.vehicle?.plate})
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserRideHistoryPanel

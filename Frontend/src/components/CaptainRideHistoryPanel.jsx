import React from 'react'
import useCaptainRides from '../hooks/useCaptainRides'

// Enum for ride status
const RideStatusEnum = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    ONGOING: 'ongoing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

const CaptainRideHistoryPanel = ({ open, setOpen }) => {
    // Use custom hook for fetching rides
    const { rides, loading, error } = useCaptainRides(open);

    return (
        <div className={`fixed z-50 top-0 right-0 w-full max-w-[910px] h-full bg-white shadow-lg transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold">Your Booking History</h2>
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
                        {rides
                            .filter(
                                ride =>
                                    ride.status === RideStatusEnum.COMPLETED ||
                                    ride.status === RideStatusEnum.CANCELLED
                            )
                            .map(ride => (
                                <div key={ride._id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-lg">{ride.pickup} → {ride.destination}</span>
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            ride.status === RideStatusEnum.COMPLETED
                                                ? 'bg-green-100 text-green-700'
                                                : ride.status === RideStatusEnum.CANCELLED
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
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
                                    {ride.user && (
                                        <div className="mt-2 text-xs text-gray-600">
                                            User: {ride.user.fullName?.firstName} {ride.user.fullName?.lastName} | Email: {ride.user.email}
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

export default CaptainRideHistoryPanel

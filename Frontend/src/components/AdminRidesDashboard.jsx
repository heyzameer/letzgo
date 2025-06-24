import React, { useEffect, useState } from 'react'
import axios from 'axios'

const statusColors = {
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    ongoing: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    pending: 'bg-gray-100 text-gray-700'
}

const AdminRidesDashboard = () => {
    const [rides, setRides] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedDate, setSelectedDate] = useState('') // format: yyyy-mm-dd
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        setLoading(true)
        setError('')
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/rides`, {
            params: {
                page,
                limit
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`
            }
        })
            .then(res => {
                // Support both old and paginated response
                if (Array.isArray(res.data)) {
                    setRides(res.data || [])
                    setTotal(res.data.length)
                    setTotalPages(1)
                } else {
                    setRides(res.data.rides || [])
                    setTotal(res.data.total || 0)
                    setTotalPages(res.data.totalPages || 1)
                }
                setLoading(false)
            })
            .catch(() => {
                setError('Failed to fetch rides')
                setLoading(false)
            })
    }, [page, limit])

    // Filter rides by selected date (if any)
    const filteredRides = selectedDate
        ? rides.filter(ride => {
            const rideDate = ride.rideDate
                ? new Date(ride.rideDate)
                : ride.createdAt
                ? new Date(ride.createdAt)
                : null;
            if (!rideDate) return false;
            // Compare only yyyy-mm-dd
            const rideDateStr = rideDate.toISOString().slice(0, 10);
            return rideDateStr === selectedDate;
        })
        : rides;

    // Calculate stats for chart
    const totalRides = filteredRides.length;
    // Only count revenue for completed rides
    const completedRides = filteredRides.filter(ride => ride.status === 'completed');
    const totalRevenue = completedRides.reduce((sum, ride) => sum + (ride.fare || 0), 0);

    // Prepare data for status breakdown
    const statusCounts = filteredRides.reduce((acc, ride) => {
        acc[ride.status] = (acc[ride.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="p-6 bg-gray-50 text-gray-800 ">
            {/* Sticky Header */}
            <h2 className="text-2xl font-bold mb-6 bg-gray-50 z-30 py-4 border-b border-gray-200">
                Rides Dashboard
            </h2>

            {/* Loading & Error */}
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600">{error}</div>}

            {/* Main Dashboard Content */}
            {!loading && !error && (
                <>
                    {/* Summary Section */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                            <h3 className="text-lg font-semibold mb-2 sm:mb-0">Summary</h3>
                            <div className="flex items-center gap-2">
                                <label htmlFor="date" className="font-medium text-sm">Select Date:</label>
                                <input
                                    id="date"
                                    type="date"
                                    className="border px-2 py-1 rounded"
                                    value={selectedDate}
                                    onChange={e => setSelectedDate(e.target.value)}
                                    max={new Date().toISOString().slice(0, 10)}
                                />
                                {selectedDate && (
                                    <button
                                        className="ml-2 text-xs text-blue-600 underline"
                                        onClick={() => setSelectedDate('')}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-blue-100 text-blue-800 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                                <div className="text-3xl font-bold">{totalRides}</div>
                                <div className="text-sm mt-1">Total Rides</div>
                            </div>
                            <div className="bg-green-100 text-green-800 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                                <div className="text-3xl font-bold">₹{totalRevenue}</div>
                                <div className="text-sm mt-1">Total Revenue (Completed)</div>
                            </div>
                        </div>
                    </div>

                    {/* Ride Status Breakdown */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Ride Status Breakdown</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {Object.entries(statusCounts).map(([status, count]) => (
                                <div
                                    key={status}
                                    className={`rounded-lg px-4 py-3 text-center font-medium shadow-sm ${
                                        statusColors[status] || 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    <div className="text-xl font-bold">{count}</div>
                                    <div className="text-xs capitalize mt-1">{status}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-auto max-h-[30vh] rounded-lg border shadow-sm">
                        <table className="w-full min-w-[800px] text-sm">
                            <thead className="sticky top-0 z-20 bg-gray-100 shadow">
                                <tr>
                                    <th className="py-3 px-4 text-left">User</th>
                                    <th className="py-3 px-4 text-left">Captain</th>
                                    <th className="py-3 px-4 text-left">Pickup</th>
                                    <th className="py-3 px-4 text-left">Destination</th>
                                    <th className="py-3 px-4 text-left">Fare</th>
                                    <th className="py-3 px-4 text-left">Status</th>
                                    <th className="py-3 px-4 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRides.map((ride) => (
                                    <tr key={ride._id} className="border-t hover:bg-gray-50 transition">
                                        <td className="py-3 px-4">
                                            <div className="font-semibold">{ride.user?.fullName?.firstName} {ride.user?.fullName?.lastName}</div>
                                            <div className="text-xs text-gray-500">{ride.user?.email}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="font-semibold">{ride.captain?.fullname?.firstname} {ride.captain?.fullname?.lastname}</div>
                                            <div className="text-xs text-gray-500">{ride.captain?.email}</div>
                                        </td>
                                        <td className="py-3 px-4">{ride.pickup}</td>
                                        <td className="py-3 px-4">{ride.destination}</td>
                                        <td className="py-3 px-4 font-bold">₹{ride.fare}</td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs px-2 py-1 rounded ${statusColors[ride.status] || 'bg-gray-200 text-gray-700'}`}>
                                                {ride.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-xs text-gray-600">
                                            {ride.rideDate
                                                ? new Date(ride.rideDate).toLocaleString()
                                                : ride.createdAt
                                                ? new Date(ride.createdAt).toLocaleString()
                                                : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredRides.length === 0 && (
                            <div className="text-center text-gray-500 py-10">No rides found.</div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between mt-4">
                        <div>
                            <span className="text-sm text-gray-600">
                                Page {page} of {totalPages} | Total Rides: {total}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page <= 1}
                            >
                                Prev
                            </button>
                            <button
                                className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                            >
                                Next
                            </button>
                            <select
                                className="ml-2 border rounded px-2 py-1"
                                value={limit}
                                onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
                            >
                                {[10, 20, 50, 100].map(opt => (
                                    <option key={opt} value={opt}>{opt} / page</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default AdminRidesDashboard

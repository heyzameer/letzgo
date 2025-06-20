import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AdminCaptainDashboard = () => {
    const [captains, setCaptains] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError('')
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/captains`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`
            }
        })
            .then(res => {
                setCaptains(res.data || [])
                setLoading(false)
            })
            .catch(() => {
                setError('Failed to fetch captains')
                setLoading(false)
            })
    }, [refresh])

    const handleBlockToggle = async (captainId, block) => {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/${block ? 'block' : 'unblock'}-captain`, { captainId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            })
            setRefresh(r => !r)
        } catch {
            alert('Failed to update captain status')
        }
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Captains Dashboard</h2>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600">{error}</div>}
            {!loading && !error && (
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 text-left">Name</th>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Vehicle</th>
                            <th className="py-2 px-4 text-left">Status</th>
                            <th className="py-2 px-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {captains.map(captain => (
                            <tr key={captain._id} className="border-t">
                                <td className="py-2 px-4">{captain.fullname?.firstname} {captain.fullname?.lastname}</td>
                                <td className="py-2 px-4">{captain.email}</td>
                                <td className="py-2 px-4">{captain.vehicle?.vehicleType} ({captain.vehicle?.plate})</td>
                                <td className="py-2 px-4">
                                    {captain.isBlocked ? (
                                        <span className="text-red-600">Blocked</span>
                                    ) : (
                                        <span className="text-green-600">Active</span>
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    {captain.isBlocked ? (
                                        <button
                                            className="bg-green-600 text-white px-3 py-1 rounded"
                                            onClick={() => handleBlockToggle(captain._id, false)}
                                        >Unblock</button>
                                    ) : (
                                        <button
                                            className="bg-red-600 text-white px-3 py-1 rounded"
                                            onClick={() => handleBlockToggle(captain._id, true)}
                                        >Block</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default AdminCaptainDashboard

import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AdminUserDashboard = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError('')
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`
            }
        })
            .then(res => {
                setUsers(res.data || [])
                setLoading(false)
            })
            .catch(() => {
                setError('Failed to fetch users')
                setLoading(false)
            })
    }, [refresh])

    const handleBlockToggle = async (userId, block) => {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/${block ? 'block' : 'unblock'}-user`, { userId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            })
            setRefresh(r => !r)
        } catch {
            alert('Failed to update user status')
        }
    }

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/admin/delete-user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            setRefresh(r => !r);
        } catch {
            alert('Failed to delete user');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Users Dashboard</h2>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600">{error}</div>}
            {!loading && !error && (
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 text-left">Name</th>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Status</th>
                            <th className="py-2 px-4 text-left">Action</th>
                            <th className="py-2 px-4 text-left">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="border-t">
                                <td className="py-2 px-4">{user.fullName?.firstName} {user.fullName?.lastName}</td>
                                <td className="py-2 px-4">{user.email}</td>
                                <td className="py-2 px-4">
                                    {user.isBlocked ? (
                                        <span className="text-red-600">Blocked</span>
                                    ) : (
                                        <span className="text-green-600">Active</span>
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    {user.isBlocked ? (
                                        <button
                                            className="bg-green-600 text-white px-3 py-1 rounded"
                                            onClick={() => handleBlockToggle(user._id, false)}
                                        >Unblock</button>
                                    ) : (
                                        <button
                                            className="bg-red-600 text-white px-3 py-1 rounded"
                                            onClick={() => handleBlockToggle(user._id, true)}
                                        >Block</button>
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    <button
                                        className="bg-red-700 text-white px-3 py-1 rounded"
                                        onClick={() => handleDelete(user._id)}
                                    >Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default AdminUserDashboard

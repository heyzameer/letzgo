import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AdminUserDashboard = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        setLoading(true)
        setError('')
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/users`, {
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
                    setUsers(res.data || [])
                    setTotal(res.data.length)
                    setTotalPages(1)
                } else {
                    setUsers(res.data.users || res.data.data || [])
                    setTotal(res.data.total || 0)
                    setTotalPages(res.data.totalPages || 1)
                }
                setLoading(false)
            })
            .catch(() => {
                setError('Failed to fetch users')
                setLoading(false)
            })
    }, [refresh, page, limit])

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
        const user = users.find(u => u._id === userId);
        let confirmMsg = 'Are you sure you want to delete this user?';
        if (user) {
            confirmMsg = `Are you sure you want to delete this user?\n\nName: ${user.fullName?.firstName || ''} ${user.fullName?.lastName || ''}\nEmail: ${user.email}`;
        }
        if (!window.confirm(confirmMsg)) return;
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
                <>
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
                {/* Pagination Controls */}
                <div className="flex items-center justify-between mt-4">
                    <div>
                        <span className="text-sm text-gray-600">
                            Page {page} of {totalPages} | Total Users: {total}
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

export default AdminUserDashboard

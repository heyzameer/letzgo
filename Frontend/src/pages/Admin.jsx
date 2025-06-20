import React, { useState } from 'react'
import AdminUserDashboard from '../components/AdminUserDashboard'
import AdminCaptainDashboard from '../components/AdminCaptainDashboard'
import AdminRidesDashboard from '../components/AdminRidesDashboard'
import axios from 'axios'

const Admin = () => {
    const [activeTab, setActiveTab] = useState('users')
    const [logoutError, setLogoutError] = useState('')

    const handleLogout = async () => {
        setLogoutError('')
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            })
        } catch (err) {
            setLogoutError('Logout failed')
        }
        localStorage.removeItem('adminToken')
        window.location.href = '/admin-login'
    }

    return (
        <div className="min-h-screen bg-gray-50 w-screen ">
            <header className="bg-black text-white px-8 py-4 flex items-center gap-8 ">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <nav className="flex gap-6">
                    <span
                        className={`cursor-pointer ${activeTab === 'users' ? 'font-semibold underline' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >Users</span>
                    <span
                        className={`cursor-pointer ${activeTab === 'captains' ? 'font-semibold underline' : ''}`}
                        onClick={() => setActiveTab('captains')}
                    >Captain</span>
                    <span
                        className={`cursor-pointer ${activeTab === 'rides' ? 'font-semibold underline' : ''}`}
                        onClick={() => setActiveTab('rides')}
                    >Ride</span>
                </nav>
                <button
                    className="ml-auto bg-red-600 text-white px-4 py-1 rounded"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </header>
            {logoutError && <div className="text-red-600 text-center mt-2">{logoutError}</div>}
            <main className=" bg-white rounded shadow p-6 px-auto">
                {activeTab === 'users' && <AdminUserDashboard />}
                {activeTab === 'captains' && <AdminCaptainDashboard />}
                {activeTab === 'rides' && <AdminRidesDashboard />}
            </main>
        </div>
    )
}

export default Admin

import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/login`, {
                email,
                password
            })
            if (res.status === 200) {
                localStorage.setItem('adminToken', res.data.token)
                navigate('/admin')
            }
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                'Invalid credentials or server error.'
            )
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded shadow max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full mb-4 px-3 py-2 border rounded"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <label className="block mb-2 font-medium">Password</label>
                    <input
                        type="password"
                        className="w-full mb-4 px-3 py-2 border rounded"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded font-semibold"
                    >
                        Login
                    </button>
                </form>
                {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
            </div>
        </div>
    )
}

export default AdminLogin

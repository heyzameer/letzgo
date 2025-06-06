import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const UserForgotPassword = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/forgot-password`, { email })
      setMessage('OTP sent to your email.')
      setStep(2)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send OTP.')
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/reset-password`, {
        email,
        otp,
        newPassword
      })
      setMessage('Password updated successfully! You can now login.')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      {/* Back arrow to user login */}
      <Link to="/login">
        <i className="ri-arrow-left-line text-2xl mb-4 cursor-pointer" style={{ color: '#222' }}></i>
      </Link>
      <h2 className="text-2xl font-bold mb-6 text-center">User Forgot Password</h2>
      {step === 1 && (
        <form onSubmit={handleSendOtp}>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            className="w-full mb-4 px-3 py-2 border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded font-semibold"
          >
            Send OTP
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleResetPassword}>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            className="w-full mb-4 px-3 py-2 border rounded bg-gray-100"
            value={email}
            disabled
          />
          <label className="block mb-2 font-medium">OTP</label>
          <input
            type="text"
            className="w-full mb-4 px-3 py-2 border rounded"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
          />
          <label className="block mb-2 font-medium">New Password</label>
          <input
            type="password"
            className="w-full mb-4 px-3 py-2 border rounded"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded font-semibold"
          >
            Reset Password
          </button>
        </form>
      )}
      {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
      {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
    </div>
  )
}

export default UserForgotPassword

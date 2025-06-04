import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const UserProfile = () => {
  const { user, setUser } = useContext(UserDataContext)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  // Fetch user profile including password (for demonstration only; not recommended in production)
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/users/profile?includePassword=true`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        setForm({
          firstName: res.data.user.fullName.firstName || '',
          lastName: res.data.user.fullName.lastName || '',
          email: res.data.user.email || '',
          password: res.data.user.password || ''
        })
        setUser(res.data.user)
      } catch (err) {
        setMessage('Failed to fetch profile.')
      }
    }
    fetchProfile()
    // eslint-disable-next-line
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/users/profile`,
        {
          fullName: {
            firstName: form.firstName,
            lastName: form.lastName
          },
          email: form.email,
          password: form.password
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setUser(res.data.user)
      setMessage('Profile updated successfully!')
    } catch (err) {
      setMessage(
        err?.response?.data?.message ||
        'Failed to update profile.'
      )
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">User Profile</h2>
        <Link to="/home"><i
          className="ri-home-line text-2xl cursor-pointer"
          style={{ color: '#222' }}
        ></i></Link>
      </div>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">First Name</label>
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <label className="block mb-2 font-medium">Last Name</label>
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <label className="block mb-2 font-medium">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <label className="block mb-2 font-medium">Password</label>
        <input
          name="password"
          type="text"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded font-semibold"
        >
          Save Changes
        </button>
        {message && (
          <div className="mt-4 text-center text-sm text-green-600">{message}</div>
        )}
      </form>
    </div>
  )
}

export default UserProfile

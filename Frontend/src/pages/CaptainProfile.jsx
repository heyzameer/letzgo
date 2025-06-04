import React, { useContext, useEffect, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CaptainProfile = () => {
  const { captain, setCaptain } = useContext(CaptainDataContext)
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    vehicleType: '',
    plate: '',
    color: '',
    capacity: ''
  })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (captain) {
      setForm({
        firstname: captain.fullname?.firstname || '',
        lastname: captain.fullname?.lastname || '',
        email: captain.email || '',
        password: captain.password || '',
        vehicleType: captain.vehicle?.vehicleType || '',
        plate: captain.vehicle?.plate || '',
        color: captain.vehicle?.color || '',
        capacity: captain.vehicle?.capacity || ''
      })
    }
  }, [captain])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/captains/profile`,
        {
          fullname: {
            firstname: form.firstname,
            lastname: form.lastname
          },
          email: form.email,
          password: form.password,
          vehicle: {
            vehicleType: form.vehicleType,
            plate: form.plate,
            color: form.color,
            capacity: form.capacity
          }
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setCaptain(res.data.captain)
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
        <h2 className="text-2xl font-bold">Captain Profile</h2>
        <i
          className="ri-home-line text-2xl cursor-pointer"
          style={{ color: '#222' }}
          onClick={() => navigate('/captain-home')}
        ></i>
      </div>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">First Name</label>
        <input
          name="firstname"
          value={form.firstname}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <label className="block mb-2 font-medium">Last Name</label>
        <input
          name="lastname"
          value={form.lastname}
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
        <label className="block mb-2 font-medium">Vehicle Type</label>
        <input
          name="vehicleType"
          value={form.vehicleType}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <label className="block mb-2 font-medium">Plate</label>
        <input
          name="plate"
          value={form.plate}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <label className="block mb-2 font-medium">Color</label>
        <input
          name="color"
          value={form.color}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <label className="block mb-2 font-medium">Capacity</label>
        <input
          name="capacity"
          type="number"
          value={form.capacity}
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

export default CaptainProfile

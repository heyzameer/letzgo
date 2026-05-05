import React, { useContext, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import CaptainLayout from '../components/CaptainLayout'
import axios from 'axios'

const CaptainSettings = () => {
  const { captain, setCaptain } = useContext(CaptainDataContext)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    firstname: captain?.fullname.firstname || '',
    lastname: captain?.fullname.lastname || '',
    email: captain?.email || '',
    color: captain?.vehicle.color || '',
    plate: captain?.vehicle.plate || '',
    capacity: captain?.vehicle.capacity || '',
    vehicleType: captain?.vehicle.vehicleType || ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')
    
    try {
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/captains/profile`, {
        fullname: {
          firstname: formData.firstname,
          lastname: formData.lastname
        },
        email: formData.email,
        vehicle: {
          color: formData.color,
          plate: formData.plate,
          capacity: formData.capacity,
          vehicleType: formData.vehicleType
        }
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.status === 200) {
        setCaptain(response.data.captain)
        setMessage('Profile updated successfully!')
      }
    } catch (error) {
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <CaptainLayout>
      <div className="max-w-4xl">
        <form onSubmit={handleUpdate} className="space-y-10">
          
          {/* Profile Header */}
          <div className="flex items-center gap-8 mb-12">
            <div className="w-24 h-24 bg-slate-100 rounded-[32px] flex items-center justify-center text-slate-400 relative group overflow-hidden">
              <i className="ri-user-fill text-4xl"></i>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <i className="ri-camera-line text-white text-xl"></i>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings</h3>
              <p className="text-slate-400 font-bold text-sm">Update your personal and vehicle information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Personal Info Section */}
            <div className="space-y-6">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">Personal Information</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                  <input 
                    type="text" 
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                  <input 
                    type="text" 
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" 
                />
              </div>
            </div>

            {/* Vehicle Info Section */}
            <div className="space-y-6">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">Vehicle Details</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Color</label>
                  <input 
                    type="text" 
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plate Number</label>
                  <input 
                    type="text" 
                    name="plate"
                    value={formData.plate}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacity</label>
                  <input 
                    type="number" 
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Type</label>
                  <select 
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none appearance-none"
                  >
                    <option value="car">Car</option>
                    <option value="moto">Moto</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100">
            {message && (
              <span className={`text-xs font-black uppercase tracking-widest ${message.includes('success') ? 'text-emerald-600' : 'text-red-500'}`}>
                {message}
              </span>
            )}
            <button 
              type="submit"
              disabled={isSaving}
              className={`ml-auto px-10 py-4 bg-black text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl shadow-black/10 active:scale-[0.98] transition-all ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-900'}`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </CaptainLayout>
  )
}

export default CaptainSettings

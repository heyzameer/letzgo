import React, { useContext, useEffect, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import CaptainLayout from '../components/CaptainLayout'
import { ProfileSkeleton } from '../components/Skeleton'

const CaptainProfile = () => {
  const { captain, setCaptain } = useContext(CaptainDataContext)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    vehicleType: '',
    plate: '',
    color: '',
    capacity: ''
  })

  useEffect(() => {
    if (captain) {
      setForm({
        firstname: captain.fullname?.firstname || '',
        lastname: captain.fullname?.lastname || '',
        email: captain.email || '',
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
    setMessage({ text: '', type: '' })
    setIsSaving(true)
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/captains/profile`,
        {
          fullname: {
            firstname: form.firstname,
            lastname: form.lastname
          },
          email: form.email,
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
      setMessage({ text: 'Profile updated successfully!', type: 'success' })
      setIsEditMode(false)
    } catch (err) {
      setMessage({ 
        text: err?.response?.data?.message || 'Failed to update profile.', 
        type: 'error' 
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!captain) return <ProfileSkeleton />;

  return (
    <CaptainLayout>
      <div className="max-w-5xl space-y-10">
        
        {/* Profile Hero */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-8">
              <div className="w-28 h-28 bg-slate-900 rounded-[36px] flex items-center justify-center text-white relative group overflow-hidden shadow-2xl shadow-black/20">
                <span className="text-4xl font-black">{captain.fullname.firstname[0]}{captain.fullname.lastname[0]}</span>
                <div className="absolute inset-0 bg-emerald-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <i className="ri-camera-3-line text-2xl"></i>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
                    {captain.fullname.firstname} {captain.fullname.lastname}
                  </h2>
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">
                    <i className="ri-check-line font-black"></i>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-bold text-slate-400">{captain.email}</p>
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">Verified Driver</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-8 py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition-all active:scale-[0.98] ${isEditMode ? 'bg-slate-100 text-slate-500' : 'bg-slate-900 text-white shadow-xl shadow-black/10'}`}
            >
              {isEditMode ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32" />
        </div>

        {isEditMode ? (
          <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Personal Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <i className="ri-user-3-line text-xl text-slate-400"></i>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Personal Information</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                    <input name="firstname" value={form.firstname} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                    <input name="lastname" value={form.lastname} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none" />
                </div>
              </div>

              {/* Vehicle Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <i className="ri-car-fill text-xl text-slate-400"></i>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Vehicle Details</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Color</label>
                    <input name="color" value={form.color} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plate Number</label>
                    <input name="plate" value={form.plate} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none uppercase" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacity</label>
                    <input name="capacity" type="number" value={form.capacity} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Type</label>
                    <select name="vehicleType" value={form.vehicleType} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none appearance-none">
                      <option value="car">UberGo (Car)</option>
                      <option value="moto">Moto (Bike)</option>
                      <option value="auto">UberAuto (Rickshaw)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {message.text && (
                  <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                    <i className={message.type === 'success' ? 'ri-checkbox-circle-fill text-lg' : 'ri-error-warning-fill text-lg'}></i>
                    <span>{message.text}</span>
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-emerald-600 text-white px-12 py-5 rounded-[24px] font-black text-xs tracking-widest uppercase shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isSaving ? 'Updating Profile...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Stats Overview */}
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Life-Time Statistics</h4>
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
                  <i className="ri-bar-chart-2-fill"></i>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-10">
                <div className="space-y-1">
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">{captain.totalRides || 0}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Trips</p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">4.9</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Rating</p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{captain.totalEarnings || 0}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Earnings</p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">{((captain.totalDistance || 0) / 1000).toFixed(1)}km</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distance Driven</p>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-slate-900 p-10 rounded-[48px] text-white relative overflow-hidden group">
              <div className="relative z-10 space-y-10">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white/40 uppercase tracking-widest">Vehicle Configuration</h4>
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white backdrop-blur-md">
                    <i className="ri-settings-5-fill"></i>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-[28px] flex items-center justify-center text-4xl text-emerald-500 border border-emerald-500/20">
                    <i className={captain.vehicle.vehicleType === 'car' ? 'ri-car-fill' : captain.vehicle.vehicleType === 'moto' ? 'ri-motorbike-fill' : 'ri-e-bike-2-fill'}></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight uppercase group-hover:text-emerald-400 transition-colors">{captain.vehicle.plate}</h3>
                    <p className="text-xs font-bold text-white/40 capitalize mt-1">{captain.vehicle.color} • {captain.vehicle.vehicleType} • {captain.vehicle.capacity} Seater</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between bg-white/5 p-5 rounded-3xl">
                    <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Status</p>
                      <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Active & Verified</p>
                    </div>
                    <i className="ri-shield-check-fill text-emerald-500 text-2xl"></i>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            </div>
          </div>
        )}

      </div>
    </CaptainLayout>
  )
}

export default CaptainProfile

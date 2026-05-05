import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'
import UserLayout from '../components/UserLayout'
import { ProfileSkeleton } from '../components/Skeleton'

const UserProfile = () => {
  const { user, setUser } = useContext(UserDataContext)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
  })

  useEffect(() => {
    if (user?.user) {
      setForm({
        firstname: user.user.fullname?.firstname || '',
        lastname: user.user.fullname?.lastname || '',
        email: user.user.email || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ text: '', type: '' })
    setIsSaving(true)
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/users/profile`,
        {
          fullName: {
            firstName: form.firstname,
            lastName: form.lastname
          },
          email: form.email
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      // The backend returns { user: ... } based on typical patterns, but let's be safe
      const updatedUser = res.data.user || res.data;
      setUser({ ...user, user: updatedUser })
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

  if (!user || !user.user) return <ProfileSkeleton />;

  const userData = user.user;
  const firstName = userData.fullname?.firstname || userData.fullname?.firstName || 'User';
  const lastName = userData.fullname?.lastname || userData.fullname?.lastName || '';
  const initials = (firstName[0] || '') + (lastName[0] || '');

  return (
    <UserLayout>
      <div className="max-w-4xl p-6 lg:p-10 space-y-10">
        
        {/* Profile Hero */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-8">
              <div className="w-28 h-28 bg-black rounded-[36px] flex items-center justify-center text-white relative group overflow-hidden shadow-2xl shadow-black/20 transition-all hover:scale-105">
                <span className="text-4xl font-black uppercase">{initials}</span>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                  <i className="ri-camera-3-line text-2xl"></i>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
                    {firstName} {lastName}
                  </h2>
                  <i className="ri-checkbox-circle-fill text-blue-500 text-2xl"></i>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-bold text-slate-400">{userData.email}</p>
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-2 py-1 rounded-lg">Active Member</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-10 py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition-all active:scale-[0.98] ${isEditMode ? 'bg-slate-100 text-slate-500' : 'bg-black text-white shadow-xl shadow-black/10 hover:bg-slate-900'}`}
            >
              {isEditMode ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32" />
        </div>

        {isEditMode ? (
          <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                <input name="firstname" value={form.firstname} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-black/5 transition-all outline-none" placeholder="John" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                <input name="lastname" value={form.lastname} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-black/5 transition-all outline-none" placeholder="Doe" />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-black/5 transition-all outline-none" placeholder="john@example.com" />
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-slate-50 flex items-center justify-between">
              {message.text && (
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                   <i className={message.type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill'}></i>
                   <span>{message.text}</span>
                </div>
              )}
              <button 
                type="submit" 
                disabled={isSaving}
                className="ml-auto bg-black text-white px-12 py-5 rounded-[24px] font-black text-xs tracking-widest uppercase shadow-2xl shadow-black/20 hover:bg-slate-900 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isSaving ? 'Updating...' : 'Save Profile'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Account Insights */}
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Account Insights</h4>
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 text-xl">
                  <i className="ri-flashlight-line"></i>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-1">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">4.8</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Rating</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">24</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trips this month</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">Gold</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loyalty Status</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">840km</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Distance</p>
                </div>
              </div>
            </div>

            {/* Quick Actions / Preferences */}
            <div className="bg-slate-50 p-10 rounded-[48px] border border-slate-100 space-y-8">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Ride Preferences</h4>
              <div className="space-y-4">
                 {[
                   { label: 'Default Vehicle', value: 'UberGo (Car)', icon: 'ri-car-fill' },
                   { label: 'Payment Method', value: 'Razorpay •••• 4242', icon: 'ri-bank-card-fill' },
                   { label: 'Language', value: 'English (US)', icon: 'ri-global-line' },
                 ].map((pref, i) => (
                   <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-200/50 flex items-center justify-between group cursor-pointer hover:border-black transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-black group-hover:bg-slate-100 transition-all">
                            <i className={pref.icon}></i>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pref.label}</p>
                            <p className="text-sm font-bold text-slate-900">{pref.value}</p>
                         </div>
                      </div>
                      <i className="ri-arrow-right-s-line text-slate-300 group-hover:text-black transition-all"></i>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </UserLayout>
  )
}

export default UserProfile

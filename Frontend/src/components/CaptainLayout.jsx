import React, { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import useCaptainLogout from '../hooks/useCaptainLogout'

const CaptainLayout = ({ children }) => {
  const { captain, isOnline, toggleOnlineStatus } = useContext(CaptainDataContext)
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useCaptainLogout()

  const NavItem = ({ icon, label, path }) => {
    const active = location.pathname === path
    return (
      <div 
        onClick={() => navigate(path)}
        className={`flex items-center gap-4 px-6 py-3.5 cursor-pointer transition-all ${active ? 'text-emerald-600 bg-emerald-50 rounded-2xl' : 'text-slate-500 hover:text-slate-900'}`}
      >
        <i className={`${icon} text-xl`}></i>
        <span className="font-bold text-sm hidden lg:block">{label}</span>
      </div>
    )
  }

  return (
    <div className='h-screen flex bg-slate-50 font-sans overflow-hidden w-full'>
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-100 flex-col p-8 shrink-0">
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
            <i className="ri-steering-2-fill text-2xl"></i>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">LetzGo</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon="ri-home-5-line" label="Home" path="/captain-home" />
          <NavItem icon="ri-wallet-3-line" label="Earnings" path="/captain-earnings" />
          <NavItem icon="ri-history-line" label="Rides" path="/captain-rides" />
          <NavItem icon="ri-bank-card-line" label="Wallet" path="/captain-wallet" />
          <NavItem icon="ri-user-3-line" label="Profile" path="/captain-profile" />
          <NavItem icon="ri-settings-4-line" label="Settings" path="/captain-settings" />
          <NavItem icon="ri-customer-service-2-line" label="Support" path="/captain-support" />
        </nav>

        <div className="mt-auto space-y-8">
          <div className="bg-slate-50 rounded-[28px] p-6">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-black uppercase tracking-widest ${isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
                {isOnline ? 'Go Offline' : 'Go Online'}
              </span>
              <button 
                onClick={toggleOnlineStatus}
                className={`w-12 h-6 rounded-full transition-all relative ${isOnline ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isOnline ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <p className="text-[10px] font-bold text-slate-400">You are currently {isOnline ? 'online' : 'offline'}</p>
          </div>

          <div className="flex items-center gap-4 p-2 cursor-pointer group" onClick={() => navigate('/captain-profile')}>
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden group-hover:ring-2 ring-emerald-500 transition-all">
              <i className="ri-user-fill text-2xl"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black text-slate-900 truncate capitalize">{captain?.fullname.firstname} {captain?.fullname.lastname}</h4>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Verified Driver</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-slate-50 relative">
        
        {/* Top Header */}
        <header className="bg-white lg:bg-transparent px-8 py-6 flex items-center justify-between z-20 shrink-0">
          <div className="lg:hidden flex items-center gap-6">
            <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600" onClick={() => navigate('/captain-home')}>
              <i className="ri-arrow-left-line text-xl"></i>
            </button>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              {location.pathname.split('-')[1]}
            </h4>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize">
              {location.pathname.split('-')[1]} Overview
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden lg:flex w-11 h-11 rounded-xl bg-white border border-slate-100 items-center justify-center text-slate-600 hover:bg-slate-50 transition-all">
              <i className="ri-notification-3-line text-xl"></i>
            </button>
            <button 
              onClick={toggleOnlineStatus}
              className={`hidden lg:flex items-center gap-3 pl-5 pr-4 py-2.5 rounded-2xl border transition-all ${isOnline ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
            >
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
            </button>
            <button onClick={logout} className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <i className="ri-logout-box-r-line text-xl"></i>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 lg:p-10 lg:pt-4">
          {children}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden bg-white border-t border-slate-100 px-8 py-5 flex items-center justify-between z-20 shrink-0">
          <div className={`flex flex-col items-center gap-1.5 ${location.pathname === '/captain-home' ? 'text-emerald-600' : 'text-slate-400'}`} onClick={() => navigate('/captain-home')}>
            <i className="ri-home-5-fill text-2xl"></i>
            <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
          </div>
          <div className={`flex flex-col items-center gap-1.5 ${location.pathname === '/captain-earnings' ? 'text-emerald-600' : 'text-slate-400'}`} onClick={() => navigate('/captain-earnings')}>
            <i className="ri-wallet-3-line text-2xl"></i>
            <span className="text-[10px] font-bold uppercase tracking-widest">Earnings</span>
          </div>
          <div className={`flex flex-col items-center gap-1.5 ${location.pathname === '/captain-rides' ? 'text-emerald-600' : 'text-slate-400'}`} onClick={() => navigate('/captain-rides')}>
            <i className="ri-history-line text-2xl"></i>
            <span className="text-[10px] font-bold uppercase tracking-widest">Rides</span>
          </div>
          <div className={`flex flex-col items-center gap-1.5 ${location.pathname === '/captain-profile' ? 'text-emerald-600' : 'text-slate-400'}`} onClick={() => navigate('/captain-profile')}>
            <i className="ri-user-3-line text-2xl"></i>
            <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
          </div>
        </nav>

      </main>
    </div>
  )
}

export default CaptainLayout

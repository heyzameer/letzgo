import React, { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import useUserLogout from '../hooks/useUserLogout'

const UserLayout = ({ children }) => {
  const { user } = useContext(UserDataContext)
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useUserLogout()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const NavItem = ({ icon, label, path, active = false }) => (
    <div 
      onClick={() => {
        path && navigate(path)
        setIsMobileMenuOpen(false)
      }}
      className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all ${active ? 'text-black bg-slate-100 rounded-2xl' : 'text-slate-500 hover:text-black hover:bg-slate-50 rounded-2xl'}`}
    >
      <i className={`${icon} text-xl`}></i>
      <span className="font-black text-xs uppercase tracking-widest hidden lg:block">{label}</span>
    </div>
  )

  const menuItems = [
    { icon: 'ri-home-5-line', label: 'Home', path: '/home' },
    { icon: 'ri-history-line', label: 'My Rides', path: '/user-rides' },
    { icon: 'ri-wallet-3-line', label: 'Payments', path: '/user-payments' },
    { icon: 'ri-user-3-line', label: 'Profile', path: '/user-profile' },
    { icon: 'ri-settings-4-line', label: 'Settings', path: '/user-settings' },
    { icon: 'ri-customer-service-2-line', label: 'Support', path: '/user-support' },
  ]

  return (
    <div className='h-screen flex bg-white font-sans overflow-hidden w-full'>
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-100 flex-col p-8 shrink-0">
        <div className="flex items-center gap-3 px-2 mb-12 cursor-pointer" onClick={() => navigate('/home')}>
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/20">
            <i className="ri-steering-2-fill text-2xl"></i>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">LetzGo</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map(item => (
            <NavItem key={item.path} {...item} active={location.pathname === item.path} />
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-50">
          <div className="flex items-center gap-4 p-2 cursor-pointer group" onClick={() => navigate('/user-profile')}>
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden group-hover:ring-2 ring-black transition-all">
               {user?.user?.fullname?.firstname[0]}{user?.user?.fullname?.lastname[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black text-slate-900 truncate capitalize">{user?.user?.fullname?.firstname}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Member</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); logout(); }} className="text-slate-300 hover:text-red-500 transition-colors">
              <i className="ri-logout-box-r-line text-lg"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        
        {/* Mobile Header (Only on non-home pages or when needed) */}
        {location.pathname !== '/home' && (
            <header className="lg:hidden bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 z-30">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                        <i className="ri-arrow-left-line text-xl"></i>
                    </button>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight capitalize">
                        {menuItems.find(i => i.path === location.pathname)?.label || 'Back'}
                    </h2>
                </div>
                <button onClick={logout} className="text-red-500">
                    <i className="ri-logout-box-r-line text-2xl"></i>
                </button>
            </header>
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>

        {/* Mobile Bottom Nav (Only on Home or Dashboard pages) */}
        <nav className="lg:hidden bg-white border-t border-slate-100 px-8 py-5 flex items-center justify-between z-30 shrink-0">
          <div className={`flex flex-col items-center gap-1 ${location.pathname === '/home' ? 'text-black' : 'text-slate-400'}`} onClick={() => navigate('/home')}>
            <i className={`${location.pathname === '/home' ? 'ri-home-5-fill' : 'ri-home-5-line'} text-2xl`}></i>
            <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
          </div>
          <div className={`flex flex-col items-center gap-1 ${location.pathname === '/user-rides' ? 'text-black' : 'text-slate-400'}`} onClick={() => navigate('/user-rides')}>
            <i className={`${location.pathname === '/user-rides' ? 'ri-history-fill' : 'ri-history-line'} text-2xl`}></i>
            <span className="text-[10px] font-black uppercase tracking-widest">Rides</span>
          </div>
          <div className={`flex flex-col items-center gap-1 ${location.pathname === '/user-profile' ? 'text-black' : 'text-slate-400'}`} onClick={() => navigate('/user-profile')}>
            <i className={`${location.pathname === '/user-profile' ? 'ri-user-3-fill' : 'ri-user-3-line'} text-2xl`}></i>
            <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
          </div>
          <div className={`flex flex-col items-center gap-1 ${location.pathname === '/user-support' ? 'text-black' : 'text-slate-400'}`} onClick={() => navigate('/user-support')}>
            <i className="ri-customer-service-2-line text-2xl"></i>
            <span className="text-[10px] font-black uppercase tracking-widest">Help</span>
          </div>
        </nav>
      </main>

    </div>
  )
}

export default UserLayout

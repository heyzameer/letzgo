import React, { useRef, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import LiveTracking from '../components/LiveTracking'
import useCaptainLogout from '../hooks/useCaptainLogout'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import CaptainDetails from '../components/CaptainDetails'
import useCaptainEarnings from '../hooks/useCaptainEarnings'

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false)
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
  const [ride, setRide] = useState(null)
  const [timeFilter, setTimeFilter] = useState('Today')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  const ridePopupPanelRef = useRef(null)
  const confirmRidePopupPanelRef = useRef(null)

  const { socket } = useContext(SocketContext)
  const { captain, isOnline, setIsOnline, toggleOnlineStatus } = useContext(CaptainDataContext)
  const { stats, loading: statsLoading } = useCaptainEarnings(true)
  const navigate = useNavigate()
  const logout = useCaptainLogout()

  useEffect(() => {
    socket.emit('join', { userType: "captain", userId: captain?._id });

    const updateLocation = () => {
      if (navigator.geolocation && isOnline) {
        navigator.geolocation.getCurrentPosition(position => {
          socket.emit('update-location-captain', {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        })
      }
    }

    const locationInterval = setInterval(updateLocation, 10000)
    updateLocation()
    return () => clearInterval(locationInterval)
  }, [isOnline, captain?._id])

  useEffect(() => {
    socket.on('new-ride', (data) => {
      setRide(data)
      setRidePopupPanel(true)
    });

    socket.on('ride-cancelled-by-user', (data) => {
      if (ride && data.rideId === ride._id) {
        setRidePopupPanel(false);
        setConfirmRidePopupPanel(false);
        setRide(null);
      }
    });

    return () => {
      socket.off('new-ride');
      socket.off('ride-cancelled-by-user');
    };
  }, [socket, ride])

  async function confirmRide() {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/ride/confirm`, {
        rideId: ride._id,
        captainId: captain._id,
        ride: ride
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
    } catch (error) {
      console.error('Failed to confirm ride:', error);
    }
  }

  const animatePopup = (ref, isOpen) => {
    if (ref.current) {
      gsap.to(ref.current, {
        y: isOpen ? '0%' : '100%',
        duration: 0.6,
        ease: 'power4.out'
      });
    }
  };

  useGSAP(() => { animatePopup(ridePopupPanelRef, ridePopupPanel); }, [ridePopupPanel])
  useGSAP(() => { animatePopup(confirmRidePopupPanelRef, confirmRidePopupPanel); }, [confirmRidePopupPanel])

  const NavItem = ({ icon, label, path, active = false }) => (
    <div 
      onClick={() => path && navigate(path)}
      className={`flex items-center gap-4 px-6 py-3.5 cursor-pointer transition-all ${active ? 'text-emerald-600 bg-emerald-50 rounded-2xl' : 'text-slate-500 hover:text-slate-900'}`}
    >
      <i className={`${icon} text-xl`}></i>
      <span className="font-bold text-sm hidden lg:block">{label}</span>
    </div>
  )

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
          <NavItem icon="ri-home-5-line" label="Home" path="/captain-home" active />
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
            <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
              <i className="ri-menu-2-line text-xl"></i>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white overflow-hidden shadow-lg shadow-black/20">
                <i className="ri-user-fill text-xl"></i>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 leading-tight capitalize">{captain?.fullname.firstname}</h4>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Good morning, {captain?.fullname.firstname}! 👋</h2>
            <p className="text-slate-400 font-bold text-sm mt-1">Ready to hit the road and earn</p>
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden lg:flex w-11 h-11 rounded-xl bg-white border border-slate-100 items-center justify-center text-slate-600 hover:bg-slate-50 transition-all">
              <i className="ri-sun-line text-xl"></i>
            </button>
            <button className="relative w-11 h-11 rounded-xl bg-white lg:bg-white border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all">
              <i className="ri-notification-3-line text-xl"></i>
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button 
              onClick={toggleOnlineStatus}
              className={`hidden lg:flex items-center gap-3 pl-5 pr-4 py-2.5 rounded-2xl border transition-all ${isOnline ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
            >
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
              <i className="ri-arrow-down-s-line ml-2"></i>
            </button>
            <button onClick={logout} className="lg:hidden w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <i className="ri-logout-box-r-line text-xl"></i>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 flex flex-col lg:flex-row p-6 lg:p-10 lg:pt-4 gap-8 lg:gap-10 overflow-hidden h-full">
          
          {/* Center Column */}
          <div className="flex-1 flex flex-col gap-8 lg:gap-10 min-w-0 h-full">
            
            {/* Stats Grid */}
            <div className="w-full shrink-0">
              <CaptainDetails />
            </div>

            {/* Map Container */}
            <div className="flex-1 bg-white rounded-[32px] border border-slate-100 relative overflow-hidden shadow-sm w-full">
              <LiveTracking />
              
              {!isOnline && (
                <div className="absolute inset-x-0 bottom-0 lg:hidden p-6 z-20">
                  <div className="bg-white rounded-[32px] p-6 shadow-2xl shadow-black/20 border border-slate-100 text-center animate-in fade-in slide-in-from-bottom-10">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Go Online to Receive Rides</h3>
                    <p className="text-slate-400 font-bold text-xs mt-2 mb-6">You'll receive ride requests in your area</p>
                    <button 
                      onClick={() => setIsOnline(true)}
                      className="w-full bg-emerald-600 text-white font-black py-4 rounded-[18px] shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all"
                    >
                      GO ONLINE
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <aside className="hidden lg:flex w-[400px] flex-col gap-8 shrink-0 h-full overflow-y-auto scrollbar-hide pb-10">
            
            {/* Desktop Go Online Card */}
            <div className="bg-white p-10 rounded-[32px] border border-slate-100 text-center shadow-sm shrink-0">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                <i className="ri-map-pin-line text-5xl"></i>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{isOnline ? 'Searching for rides...' : 'Go Online to Receive Rides'}</h3>
              <p className="text-slate-400 font-bold text-sm mt-3 mb-8">You'll receive ride requests in your area</p>
              <button 
                onClick={toggleOnlineStatus}
                className={`w-full font-black py-4 rounded-[20px] shadow-xl transition-all active:scale-[0.98] ${isOnline ? 'bg-red-50 text-red-600 shadow-red-500/10' : 'bg-emerald-600 text-white shadow-emerald-500/20'}`}
              >
                {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
              </button>
            </div>

            {/* Today's Overview */}
            <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm shrink-0">
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Today's Overview</h3>
              <div className="space-y-8">
                {[
                  { icon: 'ri-checkbox-circle-line', label: 'Rides Completed', value: stats?.todayRides || '0', color: 'text-emerald-500' },
                  { icon: 'ri-time-line', label: 'Online Time', value: captain?.onlineTime || '0h 0m', color: 'text-blue-500' },
                  { icon: 'ri-close-circle-line', label: 'Cancellation Rate', value: captain?.cancellationRate || '0%', color: 'text-red-500' },
                  { icon: 'ri-percent-line', label: 'Acceptance Rate', value: captain?.acceptanceRate || '0%', color: 'text-indigo-500' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center ${item.color}`}>
                        <i className={item.icon}></i>
                      </div>
                      <span className="text-sm font-bold text-slate-500">{item.label}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-10 border-t border-slate-50">
                <div className="flex items-center justify-between mb-4 relative">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Earnings Overview</h3>
                  <div 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-1 text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg cursor-pointer hover:bg-slate-100 transition-all"
                  >
                    <span>{timeFilter}</span>
                    <i className={`ri-arrow-down-s-line transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}></i>
                  </div>
                  
                  {isFilterOpen && (
                    <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-30 animate-in fade-in slide-in-from-top-2">
                      {['Today', 'Yesterday', 'Last 7 Days'].map(filter => (
                        <div 
                          key={filter}
                          onClick={() => { setTimeFilter(filter); setIsFilterOpen(false); }}
                          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-50 transition-colors ${timeFilter === filter ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-400'}`}
                        >
                          {filter}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <h4 className="text-2xl font-black text-slate-900">
                    {statsLoading ? '...' : 
                     timeFilter === 'Today' ? `₹${stats?.todayEarnings || 0}` : 
                     timeFilter === 'Yesterday' ? `₹${stats?.yesterdayEarnings || 0}` : 
                     `₹${stats?.last7DaysEarnings || 0}`}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Earnings</p>
                
                <div className="h-24 mt-8 flex items-end gap-1 px-2">
                  {[40, 70, 45, 90, 65, 30, 50, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-emerald-500/10 rounded-t-lg transition-all hover:bg-emerald-500 group relative cursor-pointer" style={{ height: `${h}%` }}>
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-1.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                         ₹{h * 15}
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden bg-white border-t border-slate-100 px-8 py-5 flex items-center justify-between z-20 shrink-0">
          <div className="flex flex-col items-center gap-1.5 text-emerald-600" onClick={() => navigate('/captain-home')}>
            <i className="ri-home-5-fill text-2xl"></i>
            <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-slate-400" onClick={() => navigate('/captain-earnings')}>
            <i className="ri-wallet-3-line text-2xl"></i>
            <span className="text-[10px] font-bold uppercase tracking-widest">Earnings</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-slate-400" onClick={() => navigate('/captain-rides')}>
            <i className="ri-history-line text-2xl"></i>
            <span className="text-[10px] font-bold uppercase tracking-widest">Rides</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-slate-400" onClick={() => navigate('/captain-profile')}>
            <i className="ri-user-3-line text-2xl"></i>
            <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
          </div>
        </nav>

      </main>

      {/* Ride Popups */}
      <div 
        ref={ridePopupPanelRef} 
        className='fixed inset-x-0 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[500px] bottom-0 z-40 bg-white rounded-t-[40px] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.2)] translate-y-full will-change-transform'
      >
        <div className='w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4' />
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      <div 
        ref={confirmRidePopupPanelRef} 
        className='fixed inset-x-0 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[500px] bottom-0 z-40 bg-white rounded-t-[40px] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.2)] translate-y-full will-change-transform'
      >
        <div className='w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4' />
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel} 
          setRidePopupPanel={setRidePopupPanel} 
        />
      </div>

    </div>
  )
}

export default CaptainHome

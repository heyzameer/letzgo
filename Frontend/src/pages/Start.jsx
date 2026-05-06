import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logoblack.png'
import heroCar from './letzgo_hero_car_v3_facing_left_1778070708061.png'

const Start = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full bg-white font-sans overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-700 relative flex flex-col">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-10 md:px-24 py-12 max-w-[1600px] mx-auto w-full z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img className="h-10 w-auto object-contain" src={logo} alt="LZ LetzGo" />
        </div>
        <div className="hidden md:flex items-center gap-14">
          <a href="#" className="text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors tracking-tight">Safe Rides</a>
          <a href="#" className="text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors tracking-tight">Trusted Drivers</a>
          <a href="#" className="text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors tracking-tight">Anytime, Anywhere</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-[1600px] mx-auto px-10 md:px-24 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10 -mt-10">
        
        {/* Left Content */}
        <div className="space-y-12 animate-in fade-in slide-in-from-left-10 duration-1000">
          <div className="space-y-6">
            <h1 className="text-8xl md:text-[100px] font-black text-slate-900 leading-[0.95] tracking-tighter">
              Your Ride,<br />
              Your <span className="text-[#5F69F1]">Way.</span>
            </h1>
            <p className="text-lg text-slate-400 font-bold max-w-sm leading-relaxed mt-8">
              LetzGo connects you to safe, reliable and comfortable rides near you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* User Card */}
            <div 
              onClick={() => navigate('/login')}
              className="group cursor-pointer bg-[#5F69F1] w-full sm:w-72 p-8 rounded-[28px] text-white shadow-2xl shadow-indigo-200 hover:shadow-indigo-400 transition-all hover:-translate-y-2 active:scale-95 relative overflow-hidden"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                   <i className="ri-user-fill text-2xl"></i>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] opacity-80">Continue as</p>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black tracking-tight">User</h3>
                    <i className="ri-arrow-right-line text-lg group-hover:translate-x-1 transition-transform"></i>
                  </div>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">Book your ride</p>
                </div>
              </div>
            </div>

            {/* Captain Card */}
            <div 
              onClick={() => navigate('/captain-login')}
              className="group cursor-pointer bg-[#1A1F2C] w-full sm:w-72 p-8 rounded-[28px] text-white shadow-2xl shadow-slate-200 hover:shadow-slate-400 transition-all hover:-translate-y-2 active:scale-95 relative overflow-hidden"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                   <i className="ri-police-badge-fill text-2xl"></i>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] opacity-40">Continue as</p>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black tracking-tight">Captain</h3>
                    <i className="ri-arrow-right-line text-lg group-hover:translate-x-1 transition-transform opacity-40 group-hover:opacity-100"></i>
                  </div>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Drive & earn</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Row */}
          <div className="flex items-center gap-14 pt-4 flex-wrap">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 shadow-sm">
                <i className="ri-shield-check-line text-xl"></i>
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Safe & Secure</p>
                <p className="text-[11px] text-slate-400 font-bold tracking-tight mt-0.5">Your safety is our priority</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 shadow-sm">
                <i className="ri-flashlight-line text-xl"></i>
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Fast & Reliable</p>
                <p className="text-[11px] text-slate-400 font-bold tracking-tight mt-0.5">Quick pickups every time</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 shadow-sm">
                <i className="ri-customer-service-2-line text-xl"></i>
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">24/7 Support</p>
                <p className="text-[11px] text-slate-400 font-bold tracking-tight mt-0.5">We're here for you anytime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Hero Image */}
        <div className="hidden lg:block relative h-full">
          {/* Abstract Map Background (Simplified SVG) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 pointer-events-none select-none -z-10">
            <svg viewBox="0 0 800 800" className="w-full h-full text-indigo-600">
               <path fill="currentColor" d="M100 100h600v600H100z" opacity="0.05" />
               <circle cx="400" cy="400" r="300" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 10" />
            </svg>
          </div>
          
          <div className="relative animate-in fade-in zoom-in duration-1000 delay-200 h-full flex items-center">
            <img 
            className="w-full h-auto object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(95,105,241,0.2)]" 
            src={heroCar} 
            alt="Hero Car" 
          />
            {/* Dotted path to pin */}
            <div className="absolute top-[20%] right-[20%] z-20">
               <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <i className="ri-map-pin-2-fill text-white text-xl"></i>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full pb-16 pt-10 relative z-20">
        <div className="max-w-7xl mx-auto text-center space-y-6">
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Trusted by thousands of riders and captains</p>
           <div className="flex justify-center gap-3 text-[#5F69F1]">
              <i className="ri-star-fill text-xl"></i>
              <i className="ri-star-fill text-xl"></i>
              <i className="ri-star-fill text-xl"></i>
              <i className="ri-star-fill text-xl"></i>
              <i className="ri-star-fill text-xl"></i>
           </div>
        </div>
      </footer>

      {/* Cityscape Background Overlay at Bottom */}
      <div className="fixed bottom-0 left-0 w-full h-48 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none -z-0 opacity-40">
         <div className="absolute bottom-0 left-0 w-full flex items-end justify-between px-10 overflow-hidden">
            {[...Array(40)].map((_, i) => (
               <div 
                 key={i} 
                 className="bg-slate-200" 
                 style={{ 
                   width: `${Math.random() * 40 + 20}px`, 
                   height: `${Math.random() * 100 + 40}px`,
                   marginRight: '8px'
                 }} 
               />
            ))}
         </div>
      </div>
    </div>
  )
}

export default Start

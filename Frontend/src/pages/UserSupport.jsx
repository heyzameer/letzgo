import React from 'react'
import UserLayout from '../components/UserLayout'

const UserSupport = () => {
  return (
    <UserLayout>
      <div className="max-w-4xl p-10 space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">How can we help?</h2>
          <p className="text-slate-400 font-bold text-sm">We're here 24/7 to help you with your journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[
             { title: 'Ride Issues', desc: 'Report a problem with a recent trip', icon: 'ri-car-line', color: 'bg-blue-50 text-blue-600' },
             { title: 'Payment Help', desc: 'Issues with charges or refunds', icon: 'ri-bank-card-line', color: 'bg-emerald-50 text-emerald-600' },
             { title: 'Safety Center', desc: 'Immediate assistance and safety tools', icon: 'ri-shield-user-line', color: 'bg-red-50 text-red-600' },
             { title: 'App Guide', desc: 'Learn how to use LetzGo features', icon: 'ri-book-open-line', color: 'bg-indigo-50 text-indigo-600' },
           ].map((item, i) => (
             <div key={i} className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                <div className={`w-14 h-14 ${item.color} rounded-[22px] flex items-center justify-center text-2xl mb-8 group-hover:rotate-12 transition-transform`}>
                   <i className={item.icon}></i>
                </div>
                <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">{item.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{item.desc}</p>
             </div>
           ))}
        </div>

        <div className="bg-black p-12 rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="text-center md:text-left">
              <h3 className="text-2xl font-black tracking-tight mb-2">Speak to a specialist</h3>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Available 24/7 • Response in 2 mins</p>
           </div>
           <button className="bg-white text-black px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-white/10 hover:bg-slate-100 transition-all active:scale-95">Start Chat</button>
        </div>
      </div>
    </UserLayout>
  )
}

export default UserSupport

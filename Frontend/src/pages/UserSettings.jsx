import React from 'react'
import UserLayout from '../components/UserLayout'

const UserSettings = () => {
  return (
    <UserLayout>
      <div className="max-w-4xl p-10 space-y-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h2>
          <p className="text-slate-400 font-bold text-sm mt-1">Configure your app preferences and account security</p>
        </div>

        <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
           {[
             { title: 'Notifications', desc: 'Manage your push and email alerts', icon: 'ri-notification-3-line', color: 'text-blue-500' },
             { title: 'Privacy & Security', desc: 'Password, 2FA and data settings', icon: 'ri-lock-2-line', color: 'text-emerald-500' },
             { title: 'Ride Preferences', desc: 'Default vehicle, climate, and routes', icon: 'ri-steering-2-line', color: 'text-orange-500' },
             { title: 'Linked Accounts', desc: 'Connect Google, Apple or Uber', icon: 'ri-links-line', color: 'text-indigo-500' },
             { title: 'Delete Account', desc: 'Permanently remove your data', icon: 'ri-delete-bin-line', color: 'text-red-500' },
           ].map((item, i) => (
             <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
                <div className="flex items-center gap-6">
                   <div className={`w-12 h-12 bg-slate-50 ${item.color} rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                      <i className={item.icon}></i>
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{item.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.desc}</p>
                   </div>
                </div>
                <i className="ri-arrow-right-s-line text-slate-300 group-hover:text-black transition-all"></i>
             </div>
           ))}
        </div>
      </div>
    </UserLayout>
  )
}

export default UserSettings

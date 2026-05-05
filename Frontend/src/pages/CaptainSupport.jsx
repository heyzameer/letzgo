import React from 'react'
import CaptainLayout from '../components/CaptainLayout'

const CaptainSupport = () => {
  return (
    <CaptainLayout>
      <div className="max-w-4xl space-y-10">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-[32px] flex items-center justify-center text-emerald-600 mx-auto mb-8">
            <i className="ri-customer-service-2-line text-4xl"></i>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">How can we help you?</h3>
          <p className="text-slate-400 font-bold text-sm mt-2 max-w-sm mx-auto">Our support team is available 24/7 to assist you with any ride-related issues or account queries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: 'ri-chat-smile-line', title: 'Live Chat', desc: 'Typical response: 2m', color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: 'ri-mail-line', title: 'Email Support', desc: 'Typical response: 1h', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: 'ri-phone-line', title: 'Call Center', desc: 'Priority for active rides', color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 text-2xl`}>
                <i className={item.icon}></i>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">{item.title}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 p-10 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-xl font-black tracking-tight mb-2">Frequently Asked Questions</h3>
            <p className="text-white/60 font-bold text-sm">Find quick answers to common driver questions.</p>
          </div>
          <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-emerald-500 hover:text-white transition-all active:scale-[0.98]">
            Browse FAQ
          </button>
        </div>
      </div>
    </CaptainLayout>
  )
}

export default CaptainSupport

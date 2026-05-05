import React, { useContext, useMemo } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import CaptainLayout from '../components/CaptainLayout'
import useCaptainEarnings from '../hooks/useCaptainEarnings'
import useCaptainRides from '../hooks/useCaptainRides'

const CaptainWallet = () => {
  const { captain } = useContext(CaptainDataContext)
  const { stats, loading: statsLoading } = useCaptainEarnings(true)
  const { rides, loading: ridesLoading } = useCaptainRides(true, 1, 5)

  const transactions = useMemo(() => {
    if (!rides || rides.length === 0) return [];
    
    return rides.map(ride => ({
      label: `Ride ID: #${ride._id.slice(-6).toUpperCase()}`,
      date: new Date(ride.createdAt).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      amount: `₹${ride.fare || 0}`,
      type: 'positive',
      icon: 'ri-steering-2-fill'
    }));
  }, [rides]);

  return (
    <CaptainLayout>
      <div className="max-w-5xl space-y-12 p-6 lg:p-10">
        
        {/* Wallet Balance Card */}
        <div className="bg-slate-900 p-14 rounded-[56px] text-white relative overflow-hidden shadow-2xl shadow-slate-900/40 border border-white/5">
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div>
              <div className="flex items-center gap-3 mb-10 opacity-60">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <i className="ri-bank-card-2-line text-xl text-white"></i>
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.25em]">Available Balance</h3>
              </div>
              <h2 className="text-8xl font-black tracking-tighter mb-6 flex items-baseline gap-2">
                <span className="text-4xl text-white/40">₹</span>
                {statsLoading ? '...' : (stats?.totalEarnings || 0)}
              </h2>
              <div className="flex items-center gap-3 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Withdrawal available instantly</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="bg-white text-slate-900 px-12 py-6 rounded-[24px] font-black text-xs tracking-[0.2em] uppercase hover:bg-emerald-500 hover:text-white transition-all active:scale-[0.98] shadow-2xl shadow-white/5">
                Withdraw to Bank
              </button>
              <button className="bg-white/10 text-white px-8 py-6 rounded-[24px] font-black text-xs tracking-widest uppercase hover:bg-white/20 transition-all border border-white/10 active:scale-[0.98]">
                <i className="ri-settings-4-line text-xl"></i>
              </button>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/3 opacity-40" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 opacity-30" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Detailed Breakdown */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-10 relative z-10">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Today's Payout</h3>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-2xl">Verified Revenue</span>
              </div>
              <div className="flex items-baseline gap-3 mb-10 relative z-10">
                  <h4 className="text-6xl font-black text-slate-900 tracking-tighter">₹{stats?.todayEarnings || 0}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live</p>
              </div>
              <div className="h-4 flex bg-slate-50 rounded-full overflow-hidden mb-10 relative z-10 p-1">
                  <div 
                    className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-1000" 
                    style={{ width: stats?.todayEarnings > 0 ? '75%' : '0%' }}
                  />
              </div>
              <div className="bg-slate-50 p-6 rounded-[32px] relative z-10 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Trips Completed</span>
                  <span className="text-lg font-black">{stats?.todayRides || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 p-10 rounded-[48px] text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-lg font-black tracking-tight mb-2">Earnings Summary</h3>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-10">Historical Performance</p>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center pb-6 border-b border-white/10">
                            <span className="text-xs font-bold text-white/60 uppercase">Last 7 Days</span>
                            <span className="text-xl font-black font-sans">₹{stats?.last7DaysEarnings || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white/60 uppercase">Yesterday</span>
                            <span className="text-xl font-black font-sans">₹{stats?.yesterdayEarnings || 0}</span>
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-3 bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Live ride settlements</p>
              </div>
              <button className="bg-slate-50 text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm shadow-black/5">View Statement</button>
            </div>

            <div className="space-y-10">
              {ridesLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-slate-50 rounded-3xl" />
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-slate-50 rounded" />
                                <div className="h-3 w-20 bg-slate-50 rounded" />
                            </div>
                        </div>
                        <div className="h-6 w-16 bg-slate-50 rounded" />
                    </div>
                  ))
              ) : transactions.length > 0 ? (
                transactions.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-2xl transition-all group-hover:scale-110 shadow-sm ${item.type === 'positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-900'}`}>
                        <i className={item.icon}></i>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-base font-black text-slate-900">{item.label}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</span>
                            <div className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Settled</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xl font-black text-slate-900 font-sans">
                      {item.amount}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-200">
                        <i className="ri-history-line text-4xl"></i>
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-slate-900">No Activity Yet</h4>
                        <p className="text-sm font-bold text-slate-400 mt-1 max-w-[200px]">Complete your first ride to start seeing transactions here.</p>
                    </div>
                </div>
              )}
            </div>
            
            {transactions.length > 0 && (
                <div className="mt-12 pt-12 border-t border-slate-50 text-center">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">End of recent activity</p>
                </div>
            )}
          </div>
        </div>

      </div>
    </CaptainLayout>
  )
}

export default CaptainWallet

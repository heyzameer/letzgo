import React, { useContext, useState, useMemo } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import CaptainLayout from '../components/CaptainLayout'
import useCaptainEarnings from '../hooks/useCaptainEarnings'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CaptainEarnings = () => {
  const { captain } = useContext(CaptainDataContext)
  const [timeFilter, setTimeFilter] = useState('This Week')
  const { stats, loading } = useCaptainEarnings(true)

  const chartData = useMemo(() => {
    if (!stats?.dailyBreakdown) return [];
    
    // Convert backend breakdown (YYYY-MM-DD) to readable chart format
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return stats.dailyBreakdown.map(item => ({
        name: days[new Date(item._id).getDay()],
        value: item.earnings,
        fullDate: item._id
    }));
  }, [stats]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-white/10 shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{payload[0].payload.fullDate}</p>
          <p className="text-sm font-black">₹{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <CaptainLayout>
      <div className="max-w-6xl space-y-10 p-6 lg:p-10">
        
        {/* Earnings Hero */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest animate-pulse">Live Analytics</span>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Earnings Overview</h3>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black text-slate-900 tracking-tighter">₹{stats?.todayEarnings || 0}</span>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Today</span>
            </div>
            <p className="text-slate-400 font-bold text-sm mt-3">You've completed {stats?.todayRides || 0} rides today</p>
          </div>
          
          <div className="flex gap-6 relative z-10">
            <div className="bg-slate-50 p-8 rounded-[36px] text-center min-w-[160px] border border-slate-100 shadow-sm">
              <h4 className="text-3xl font-black text-slate-900 leading-none">₹{stats?.yesterdayEarnings || 0}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">Yesterday</p>
            </div>
            <div className="bg-black p-8 rounded-[36px] text-center min-w-[160px] shadow-xl shadow-black/10">
              <h4 className="text-3xl font-black text-white leading-none">₹{stats?.last7DaysEarnings || 0}</h4>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-3">Last 7 Days</p>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32" />
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Earnings Trend</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Daily revenue breakdown</p>
              </div>
              <div className="bg-slate-50 p-1.5 rounded-2xl flex gap-1">
                {['This Week', 'Monthly'].map(f => (
                    <button 
                        key={f}
                        onClick={() => setTimeFilter(f)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeFilter === f ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}
                    >
                        {f}
                    </button>
                ))}
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              {loading ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50/50 rounded-[32px] animate-pulse">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Generating Chart...</span>
                  </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={45}>
                        {chartData.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={entry.value === Math.max(...chartData.map(d => d.value)) ? '#10b981' : '#f1f5f9'} 
                            className="hover:fill-emerald-400 transition-colors cursor-pointer" 
                        />
                        ))}
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
              ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-[32px] gap-4">
                      <i className="ri-bar-chart-box-line text-4xl text-slate-200"></i>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No data available for this period</p>
                  </div>
              )}
            </div>
          </div>

          {/* Breakdown Section */}
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-10">Financial Health</h3>
            <div className="space-y-8 flex-1">
              {[
                { label: 'Net Earnings', value: stats?.totalEarnings || 0, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'ri-wallet-3-fill' },
                { label: 'Completed Rides', value: stats?.totalRides || 0, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: 'ri-steering-fill' },
                { label: 'Avg per Trip', value: stats?.totalRides ? `₹${(stats.totalEarnings / stats.totalRides).toFixed(0)}` : '₹0', color: 'text-orange-600', bg: 'bg-orange-50', icon: 'ri-funds-box-fill' },
                { label: 'System Fees', value: '₹0', color: 'text-slate-400', bg: 'bg-slate-50', icon: 'ri-percent-fill' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center text-xl transition-transform group-hover:scale-110`}>
                      <i className={item.icon}></i>
                    </div>
                    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{item.label}</span>
                  </div>
                  <span className="text-lg font-black text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-10 border-t border-slate-50">
              <button className="w-full py-5 rounded-[24px] bg-black text-white font-black text-xs tracking-widest hover:bg-slate-800 transition-all uppercase flex items-center justify-center gap-3 shadow-2xl shadow-black/10 active:scale-[0.98]">
                <span>Payout Settings</span>
                <i className="ri-arrow-right-up-line text-lg"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    </CaptainLayout>
  )
}

export default CaptainEarnings

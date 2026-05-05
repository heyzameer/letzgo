import React, { useContext, useState, useMemo } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import CaptainLayout from '../components/CaptainLayout'
import useCaptainRides from '../hooks/useCaptainRides'

const CaptainRides = () => {
  const { captain } = useContext(CaptainDataContext)
  const [filter, setFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const { rides, loading, totalPages, total } = useCaptainRides(true, page, limit)

  const filteredRides = useMemo(() => {
    return rides.filter(ride => {
      if (filter === 'All') return true;
      return ride.status.toLowerCase() === filter.toLowerCase();
    });
  }, [rides, filter]);

  return (
    <CaptainLayout>
      <div className="max-w-6xl space-y-10 p-6 lg:p-10">
        
        {/* Header with Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ride History</h2>
            <p className="text-slate-400 font-bold text-sm mt-1">Review and manage your completed trips</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            {['All', 'Completed', 'Cancelled'].map(f => (
              <button 
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-slate-900 text-white shadow-lg shadow-black/10' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Trips', value: total, icon: 'ri-steering-2-line', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Cancelled', value: rides.filter(r => r.status === 'cancelled').length, icon: 'ri-close-circle-line', color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Rating', value: '4.9', icon: 'ri-star-line', color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Success Rate', value: '98%', icon: 'ri-checkbox-circle-line', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-xl shrink-0`}>
                <i className={stat.icon}></i>
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 leading-none">{stat.value}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Rides List */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading trips...</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fare</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filteredRides.map((ride, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors cursor-pointer group">
                        <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 uppercase">
                                {ride.user?.fullname?.firstname?.[0] || '?'}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-slate-900 text-sm leading-tight">
                                    {ride.user?.fullname?.firstname} {ride.user?.fullname?.lastname}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                                    {new Date(ride.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                        </td>
                        <td className="px-8 py-6">
                        <div className="flex flex-col gap-1 max-w-[250px]">
                            <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span className="text-xs font-bold text-slate-700 truncate">{ride.pickup}</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="text-xs font-bold text-slate-900 truncate">{ride.destination}</span>
                            </div>
                        </div>
                        </td>
                        <td className="px-8 py-6">
                        <div className="flex flex-col">
                            <span className="font-black text-slate-900 text-sm">₹{ride.fare}</span>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">Received</span>
                        </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest ${ride.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {ride.status}
                        </span>
                        </td>
                    </tr>
                    ))}
                    {filteredRides.length === 0 && (
                        <tr>
                            <td colSpan="4" className="py-20 text-center">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No records found</p>
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
          )}
          
          {/* Pagination Controls */}
          <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Showing Page {page} of {totalPages} • Total {total} Trips
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30 shadow-sm"
                disabled={page === 1}
              >
                <i className="ri-arrow-left-s-line"></i>
              </button>
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-black/10">
                {page}
              </div>
              <button 
                onClick={() => setPage(p => p + 1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30 shadow-sm"
                disabled={page >= totalPages}
              >
                <i className="ri-arrow-right-s-line"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    </CaptainLayout>
  )
}

export default CaptainRides

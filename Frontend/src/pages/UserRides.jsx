import React, { useContext, useState, useMemo } from 'react'
import { UserDataContext } from '../context/UserContext'
import UserLayout from '../components/UserLayout'
import useUserRides from '../hooks/useUserRides'

const UserRides = () => {
  const { user } = useContext(UserDataContext)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [selectedDate, setSelectedDate] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const { rides, loading, totalPages, total } = useUserRides(true, page, limit)

  // Filtering logic
  const filteredRides = useMemo(() => {
    return rides.filter(ride => {
      const matchesStatus = statusFilter === 'All' || ride.status.toLowerCase() === statusFilter.toLowerCase();
      
      const rideDate = ride.rideDate || ride.createdAt;
      const rideDateStr = rideDate ? new Date(rideDate).toISOString().slice(0, 10) : '';
      const matchesDate = !selectedDate || rideDateStr === selectedDate;
      
      return matchesStatus && matchesDate;
    });
  }, [rides, statusFilter, selectedDate]);

  const downloadCSV = () => {
    const headers = ['Ride ID', 'Date', 'Pickup', 'Destination', 'Fare', 'Status', 'Captain'];
    const data = filteredRides.map(r => [
      r._id,
      new Date(r.rideDate || r.createdAt).toLocaleString(),
      r.pickup,
      r.destination,
      r.fare,
      r.status,
      r.captain ? `${r.captain.fullname.firstname} ${r.captain.fullname.lastname}` : 'N/A'
    ]);

    const csvContent = [headers, ...data].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `letzgo_rides_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <UserLayout>
      <div className="max-w-6xl p-6 lg:p-10 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trip History</h2>
            <p className="text-slate-400 font-bold text-sm mt-1">Manage and export your recent activities</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                {['All', 'Completed', 'Cancelled'].map(f => (
                <button 
                    key={f}
                    onClick={() => { setStatusFilter(f); setPage(1); }}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === f ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    {f}
                </button>
                ))}
            </div>

            <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2 rounded-2xl">
                <i className="ri-calendar-line text-slate-400"></i>
                <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => { setSelectedDate(e.target.value); setPage(1); }}
                    className="text-[10px] font-black uppercase tracking-widest outline-none border-none bg-transparent cursor-pointer"
                />
                {selectedDate && (
                    <button onClick={() => { setSelectedDate(''); setPage(1); }} className="text-slate-300 hover:text-red-500 transition-colors">
                        <i className="ri-close-circle-fill"></i>
                    </button>
                )}
            </div>

            <button 
                onClick={downloadCSV}
                className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
            >
                Export CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Rides', value: total, icon: 'ri-steering-2-line', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'This Month', value: '12', icon: 'ri-calendar-event-line', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Total Savings', value: '₹420', icon: 'ri-leaf-line', color: 'text-green-600', bg: 'bg-green-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all group">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-[20px] flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                <i className={stat.icon}></i>
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-900 leading-none">{stat.value}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Rides Table */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
             <div className="p-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-black rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching your rides...</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Route</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Captain</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fare</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filteredRides.map((ride, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors cursor-pointer group">
                        <td className="px-8 py-8">
                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex flex-col items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                                <div className="w-px h-6 bg-slate-100" />
                                <div className="w-2 h-2 rounded-sm bg-black" />
                            </div>
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="font-black text-slate-900 text-sm truncate max-w-[200px] lg:max-w-md">{ride.pickup} → {ride.destination}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                    {new Date(ride.rideDate || ride.createdAt).toLocaleString()} • {ride._id.slice(-8)}
                                </span>
                            </div>
                        </div>
                        </td>
                        <td className="px-8 py-8">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 uppercase border border-slate-100 shadow-sm">
                                {ride.captain ? ride.captain.fullname.firstname[0] : '?'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-700 leading-tight">
                                    {ride.captain ? `${ride.captain.fullname.firstname} ${ride.captain.fullname.lastname}` : 'Searching...'}
                                </span>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-0.5">Verified Partner</span>
                            </div>
                        </div>
                        </td>
                        <td className="px-8 py-8">
                        <div className="flex flex-col">
                            <span className="font-black text-slate-900 text-sm">₹{ride.fare}</span>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">Online Paid</span>
                        </div>
                        </td>
                        <td className="px-8 py-8 text-right">
                        <span className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest ${ride.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {ride.status}
                        </span>
                        </td>
                    </tr>
                    ))}
                    {filteredRides.length === 0 && (
                        <tr>
                            <td colSpan="4" className="px-8 py-20 text-center">
                                <div className="text-slate-300 text-5xl mb-4"><i className="ri-ghost-line"></i></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No rides found for the selected criteria</p>
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
          )}
          
          <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/30">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Page {page} of {totalPages} • Total {total} Activities
            </p>
            
            <div className="flex items-center gap-3">
                <button 
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-black hover:border-black disabled:opacity-30 transition-all shadow-sm"
                >
                    <i className="ri-arrow-left-s-line text-xl"></i>
                </button>
                <div className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black">
                    {page}
                </div>
                <button 
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-black hover:border-black disabled:opacity-30 transition-all shadow-sm"
                >
                    <i className="ri-arrow-right-s-line text-xl"></i>
                </button>
            </div>
          </div>
        </div>

      </div>
    </UserLayout>
  )
}

export default UserRides

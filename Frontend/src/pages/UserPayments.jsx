import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'
import UserLayout from '../components/UserLayout'
import useUserRides from '../hooks/useUserRides'

const UserPayments = () => {
  const { user } = useContext(UserDataContext)
  const { rides, loading } = useUserRides(true, 1, 5) // Fetch 5 most recent for "Recent Activity"

  const userData = user?.user;
  const balance = userData?.balance || 0; // Assuming balance exists or defaulting to 0

  return (
    <UserLayout>
      <div className="max-w-5xl p-6 lg:p-10 space-y-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Payments & Wallet</h2>
          <p className="text-slate-400 font-bold text-sm mt-1">Manage your payment methods and track transactions</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Wallet Card */}
            <div className="xl:col-span-2 bg-slate-900 p-12 rounded-[48px] text-white shadow-2xl shadow-black/20 relative overflow-hidden group">
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Available Balance</p>
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <i className="ri-wallet-3-line text-2xl"></i>
                            </div>
                        </div>
                        <h3 className="text-6xl font-black mt-4 tracking-tighter">₹{balance.toLocaleString()}</h3>
                    </div>
                    
                    <div className="flex gap-4 mt-12">
                        <button className="bg-emerald-500 text-black px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all hover:bg-emerald-400">
                            Add Funds
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all">
                            Statement
                        </button>
                    </div>
                </div>
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-emerald-500/30 transition-colors" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />
            </div>

            {/* Quick Stats */}
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col justify-between gap-8">
                <div className="space-y-8">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Monthly Spending</h4>
                    <div className="space-y-2">
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">₹2,840</p>
                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
                            <i className="ri-arrow-right-up-line"></i>
                            <span>12% vs last month</span>
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-slate-50">
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        <span>Reward Points</span>
                        <span className="text-slate-900">1,240 pts</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-black rounded-full" />
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Recent Transactions (From Ride History) */}
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Recent Activity</h4>
                    <button className="text-[10px] font-black text-slate-900 uppercase tracking-widest hover:underline">View All</button>
                </div>
                
                <div className="space-y-6">
                    {loading ? (
                        <div className="py-10 text-center text-slate-300 font-bold text-xs uppercase animate-pulse">Loading activity...</div>
                    ) : rides.length > 0 ? rides.map((ride, i) => (
                        <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-black group-hover:bg-slate-100 transition-all border border-slate-100">
                                    <i className="ri-car-fill text-xl"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 leading-tight">Ride Payment</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                                        {new Date(ride.rideDate || ride.createdAt).toLocaleDateString()} • {ride.status}
                                    </p>
                                </div>
                            </div>
                            <p className="font-black text-slate-900 tracking-tight">- ₹{ride.fare}</p>
                        </div>
                    )) : (
                        <p className="text-center py-10 text-[10px] font-black text-slate-300 uppercase tracking-widest">No recent transactions</p>
                    )}
                </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-slate-50/50 p-10 rounded-[48px] border border-slate-100 space-y-10">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Payment Methods</h4>
                    <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:scale-105 transition-all">
                        <i className="ri-add-line text-xl"></i>
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between group cursor-pointer hover:border-black transition-all">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                                <i className="ri-visa-line text-2xl text-blue-600"></i>
                            </div>
                            <div>
                                <p className="font-black text-slate-900">•••• 4242</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expires 12/28</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-100">Primary</span>
                    </div>
                    
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between group cursor-pointer hover:border-black transition-all">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-black text-indigo-600">
                                UPI
                            </div>
                            <div>
                                <p className="font-black text-slate-900">user@okaxis</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Linked</p>
                            </div>
                        </div>
                        <i className="ri-arrow-right-s-line text-slate-300 group-hover:text-black transition-all"></i>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </UserLayout>
  )
}

export default UserPayments

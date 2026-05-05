import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import useCaptainEarnings from '../hooks/useCaptainEarnings'

const StatCard = ({ icon, value, label, color, loading }) => (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow w-full">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${color} shrink-0`}>
            {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <i className={icon}></i>
            )}
        </div>
        <div className="min-w-0">
            <h5 className="text-xl font-black text-slate-900 leading-none truncate">
                {loading ? '...' : value}
            </h5>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{label}</p>
        </div>
    </div>
)

const CaptainDetails = () => {
    const { captain } = useContext(CaptainDataContext)
    const { stats, loading } = useCaptainEarnings(true)

    return (
        <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8'>
            <StatCard 
                icon="ri-steering-2-line" 
                value={stats?.todayRides || 0} 
                label="Rides Today" 
                color="bg-emerald-50 text-emerald-600" 
                loading={loading}
            />
            <StatCard 
                icon="ri-pin-distance-line" 
                value={captain?.totalDistance ? (captain.totalDistance / 1000).toFixed(1) : 0} 
                label="Total Km" 
                color="bg-orange-50 text-orange-600" 
                loading={false}
            />
            <StatCard 
                icon="ri-wallet-3-line" 
                value={`₹${stats?.todayEarnings || 0}`} 
                label="Earnings Today" 
                color="bg-indigo-50 text-indigo-600" 
                loading={loading}
            />
        </div>
    )
}

export default CaptainDetails
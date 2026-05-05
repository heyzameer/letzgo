import { useEffect, useState } from 'react'
import axios from 'axios'

const useCaptainEarnings = (enabled = true) => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const fetchStats = async () => {
        if (!enabled) return;
        setLoading(true)
        setError('')
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/captains/earnings-stats`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setStats(res.data)
        } catch (err) {
            setError('Failed to fetch earnings statistics')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [enabled])

    return { stats, loading, error, refresh: fetchStats }
}

export default useCaptainEarnings

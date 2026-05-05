import { useEffect, useState } from 'react'
import axios from 'axios'

const useCaptainRides = (enabled = true, page = 1, limit = 10) => {
    const [rides, setRides] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        if (!enabled) return;
        setLoading(true)
        setError('')
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/ride/captain/history`, {
            params: { page, limit },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                if (Array.isArray(res.data)) {
                    setRides(res.data || [])
                    setTotal(res.data.length)
                    setTotalPages(1)
                } else {
                    setRides(res.data.rides || [])
                    setTotal(res.data.total || 0)
                    setTotalPages(res.data.totalPages || 1)
                }
                setLoading(false)
            })
            .catch(() => {
                setError('Failed to fetch ride history')
                setLoading(false)
            })
    }, [enabled, page, limit])

    return { rides, loading, error, totalPages, total }
}

export default useCaptainRides

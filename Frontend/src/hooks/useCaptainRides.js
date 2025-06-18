import { useEffect, useState } from 'react'
import axios from 'axios'

const useCaptainRides = (enabled = true) => {
    const [rides, setRides] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!enabled) return;
        setLoading(true)
        setError('')
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/ride/captain/history`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                setRides(res.data || [])
                setLoading(false)
            })
            .catch(() => {
                setError('Failed to fetch ride history')
                setLoading(false)
            })
    }, [enabled])

    return { rides, loading, error }
}

export default useCaptainRides

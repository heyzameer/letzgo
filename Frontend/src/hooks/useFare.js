import { useState, useCallback } from 'react'
import axios from 'axios'

const useFare = () => {
    const [fare, setFare] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const getFare = useCallback(async (pickup, destination) => {
        setLoading(true)
        setError('')
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/ride/get-fare`, {
                params: { pickup, destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setFare(response.data)
        } catch (err) {
            setError('Failed to fetch fare')
        } finally {
            setLoading(false)
        }
    }, [])

    return { fare, loading, error, getFare }
}

export default useFare

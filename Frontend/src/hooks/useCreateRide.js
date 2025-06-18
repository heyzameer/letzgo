import { useState, useCallback } from 'react'
import axios from 'axios'

const useCreateRide = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [data, setData] = useState(null)

    const createRide = useCallback(async ({ pickup, destination, vehicleType }) => {
        setLoading(true)
        setError('')
        setData(null)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/ride/create`, {
                pickup,
                destination,
                vehicleType
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setData(response.data)
        } catch (err) {
            setError('Failed to create ride')
        } finally {
            setLoading(false)
        }
    }, [])

    return { createRide, loading, error, data }
}

export default useCreateRide

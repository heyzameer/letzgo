import { useState, useCallback } from 'react'
import axios from 'axios'

const useSuggestions = () => {
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const getSuggestions = useCallback(async (input) => {
        setLoading(true)
        setError('')
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestions`, {
                params: { input },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setSuggestions(response.data)
        } catch (err) {
            setError('Failed to fetch suggestions')
        } finally {
            setLoading(false)
        }
    }, [])

    return { suggestions, loading, error, getSuggestions }
}

export default useSuggestions

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminProtectWrapper = ({ children }) => {
    const token = localStorage.getItem('adminToken')
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    console.log("Admin token:", token)
    useEffect(() => {
        if (!token) {
            navigate('/admin-login')
            return
        }
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => setIsLoading(false))
            .catch(() => {
                localStorage.removeItem('adminToken')
                navigate('/admin-login')
            })
    }, [token])

    if (isLoading) {
        return <div>Admin Loading...</div>
    }

    return <>{children}</>
}

export default AdminProtectWrapper

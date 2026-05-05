import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
    const [ captain, setCaptain ] = useState(null);
    const [ isOnline, setIsOnline ] = useState(() => {
        const saved = localStorage.getItem('captain_online_status');
        return saved === 'true';
    });
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        localStorage.setItem('captain_online_status', isOnline);
        
        // Sync with backend if token exists
        const token = localStorage.getItem('token');
        if (token && captain) {
            axios.patch(`${import.meta.env.VITE_BASE_URL}/api/captains/update-status`, 
                { status: isOnline ? 'active' : 'inactive' },
                { headers: { Authorization: `Bearer ${token}` } }
            ).catch(err => console.error('Failed to sync status with backend:', err));
        }
    }, [isOnline]);

    const updateCaptain = (captainData) => {
        setCaptain(captainData);
    };

    const toggleOnlineStatus = () => {
        setIsOnline(prev => !prev);
    };

    const value = {
        captain,
        setCaptain,
        isOnline,
        setIsOnline,
        toggleOnlineStatus,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain
    };

    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const useUserLogout = () => {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users/logout`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (err) {
            // ignore error, proceed to logout anyway
        }
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    return logout;
};

export default useUserLogout;

import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Start from './pages/Start'
import UserSignup from './pages/UserSignup'
import UserLogin from './pages/UserLogin'
import CaptainSignup from './pages/CaptainSignup'
import CaptainLogin from './pages/CaptainLogin'
import Home from './pages/Home'
import UserLogout from './pages/UserLogout'
import UserProtectWrapper from './pages/UserProtectWrapper'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import 'remixicon/fonts/remixicon.css'
import './App.css';
import UserRides from './pages/UserRides'
import UserPayments from './pages/UserPayments'
import UserSettings from './pages/UserSettings'
import UserSupport from './pages/UserSupport'
import UserProfile from './pages/UserProfile'
import CaptainProfile from './pages/CaptainProfile'
import CaptainForgotPassword from './pages/CaptainForgotPassword'
import UserForgotPassword from './pages/UserForgotPassword'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'
import AdminProtectWrapper from './pages/AdminProtectWrapper'
import CaptainEarnings from './pages/CaptainEarnings'
import CaptainRides from './pages/CaptainRides'
import CaptainWallet from './pages/CaptainWallet'
import CaptainSettings from './pages/CaptainSettings'
import CaptainSupport from './pages/CaptainSupport'

const App = () => {
  const location = useLocation();
  
  return (
    <div className="w-screen h-screen overflow-hidden bg-white">
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/user-forgot-password" element={<UserForgotPassword />} />
        <Route path="/captain-forgot-password" element={<CaptainForgotPassword />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        
        {/* User Dashboard Routes */}
        <Route path="/home" element={<UserProtectWrapper><Home /></UserProtectWrapper>} />
        <Route path='/user-profile' element={<UserProtectWrapper><UserProfile /></UserProtectWrapper>} />
        <Route path='/user-rides' element={<UserProtectWrapper><UserRides /></UserProtectWrapper>} />
        <Route path='/user-payments' element={<UserProtectWrapper><UserPayments /></UserProtectWrapper>} />
        <Route path='/user-settings' element={<UserProtectWrapper><UserSettings /></UserProtectWrapper>} />
        <Route path='/user-support' element={<UserProtectWrapper><UserSupport /></UserProtectWrapper>} />
        
        <Route path='/user/logout' element={<UserProtectWrapper><UserLogout /></UserProtectWrapper>} />
        <Route path='/riding' element={<UserProtectWrapper><Riding /></UserProtectWrapper>} />
        
        {/* Captain Dashboard Routes */}
        <Route path='/captain-home' element={<CaptainProtectWrapper><CaptainHome /></CaptainProtectWrapper>} />
        <Route path='/captain-earnings' element={<CaptainProtectWrapper><CaptainEarnings /></CaptainProtectWrapper>} />
        <Route path='/captain-rides' element={<CaptainProtectWrapper><CaptainRides /></CaptainProtectWrapper>} />
        <Route path='/captain-wallet' element={<CaptainProtectWrapper><CaptainWallet /></CaptainProtectWrapper>} />
        <Route path='/captain-settings' element={<CaptainProtectWrapper><CaptainSettings /></CaptainProtectWrapper>} />
        <Route path='/captain-support' element={<CaptainProtectWrapper><CaptainSupport /></CaptainProtectWrapper>} />
        <Route path='/captain-profile' element={<CaptainProtectWrapper><CaptainProfile /></CaptainProtectWrapper>} />
        <Route path='/captain-riding' element={<CaptainProtectWrapper><CaptainRiding /></CaptainProtectWrapper>} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminProtectWrapper><Admin /></AdminProtectWrapper>} />
      </Routes>
    </div>
  )
}

export default App

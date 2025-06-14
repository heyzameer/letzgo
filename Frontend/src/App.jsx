import React from 'react'
import { Routes, Route } from 'react-router-dom'
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
import UserProfile from './pages/UserProfile'
import CaptainProfile from './pages/CaptainProfile'
import CaptainForgotPassword from './pages/CaptainForgotPassword'
import UserForgotPassword from './pages/UserForgotPassword'

const App = () => {
  return (
    <div className="app-container">
       <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[910px]  bg-white  overflow-auto scrollbar-hide">
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/user-forgot-password" element={<UserForgotPassword />} />
        <Route path="/captain-forgot-password" element={<CaptainForgotPassword />} />
        <Route path="/riding" element={<Riding />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-riding" element={<CaptainRiding />} />
        <Route path="/home" element={<UserProtectWrapper><Home /></UserProtectWrapper>} />
        {/* <Route path="/home" element={<Home/>} /> */}
        <Route path='/user/logout'
          element={<UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
          } />
        <Route path='/user-profile'
          element={<UserProfile />} />
        <Route path='/captain-home' element={
          <CaptainProtectWrapper>
            <CaptainHome />
          </CaptainProtectWrapper>
        } />
        <Route path='/captain-profile' element={
          <CaptainProtectWrapper>
            <CaptainProfile />
          </CaptainProtectWrapper>
        } />
      </Routes>
      </div>
       </div>
    </div>
  )
}

export default App

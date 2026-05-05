import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'
import logo from '../assets/logoblack.png'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email'
    if (!password) newErrors.password = 'Password is required'
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long'
    return newErrors
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    const validationErrors = validateForm()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix the errors below.')
      return
    }

    setIsLoading(true)
    try {
      const userData = { email, password }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/login`, userData)

      if (response.status === 200) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login failed')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setEmail('user@demo.com')
    setPassword('password123')
  }

  return (
    <div className='min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 font-sans'>
      <div className='w-full max-w-xl bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 transition-all duration-700 hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.15)]'>
        <div className='p-10 sm:p-14'>
          <div className='flex flex-col items-center mb-12 text-center'>
            <div className='bg-black p-6 rounded-3xl mb-8 shadow-2xl shadow-black/30 transform hover:scale-105 transition-transform duration-500'>
              <img
                className="w-16 h-16 object-contain invert"
                src={logo}
                alt="LetzGo Logo"
              />
            </div>
            <h1 className='text-4xl font-black text-slate-900 tracking-tight mb-3'>Welcome Back</h1>
            <p className='text-slate-400 text-lg font-medium max-w-xs'>Log in to your account and get back on the road</p>
          </div>

          <form onSubmit={submitHandler} className='space-y-6'>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300" role="alert">
                <div className='flex items-center gap-3'>
                  <span className='text-xl'>⚠️</span>
                  <div>
                    <p className="font-bold text-sm">Authentication Error</p>
                    <p className="text-xs opacity-90">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className='group'>
              <label className='block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1'>Email Address</label>
              <div className='relative'>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 outline-none text-slate-900 font-medium ${
                    errors.email ? 'border-red-300 bg-red-50/30' : 'border-slate-200 group-hover:border-slate-300 focus:border-black focus:ring-4 focus:ring-black/5'
                  }`}
                  type="email"
                  placeholder='name@example.com'
                />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold uppercase tracking-wider">{errors.email}</p>}
            </div>

            <div className='group'>
              <div className='flex justify-between items-center mb-2 ml-1'>
                <label className='block text-xs font-bold text-slate-500 uppercase tracking-widest'>Password</label>
                <Link to="/user-forgot-password" size="sm" className="text-xs font-bold text-black hover:text-slate-600 transition-colors">
                  FORGOT?
                </Link>
              </div>
              <div className='relative'>
                <input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 outline-none text-slate-900 font-medium ${
                    errors.password ? 'border-red-300 bg-red-50/30' : 'border-slate-200 group-hover:border-slate-300 focus:border-black focus:ring-4 focus:ring-black/5'
                  }`}
                  type="password"
                  placeholder='••••••••'
                />
              </div>
              {errors.password && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold uppercase tracking-wider">{errors.password}</p>}
            </div>

            <button
              disabled={isLoading}
              className='w-full bg-black text-white font-black py-5 rounded-[20px] text-sm tracking-[0.2em] transition-all duration-500 hover:bg-slate-800 hover:shadow-2xl hover:shadow-black/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-4 group mt-4'
            >
              {isLoading ? (
                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>CONTINUE</span>
                  <span className='group-hover:translate-x-1.5 transition-transform'>→</span>
                </>
              )}
            </button>
          </form>

          <div className='mt-10 relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-slate-100'></div>
            </div>
            <div className='relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]'>
              <span className='bg-white px-4 text-slate-400'>Easy Access</span>
            </div>
          </div>

          <div className='mt-8'>
            <button
              onClick={handleDemoLogin}
              className='w-full group flex items-center justify-between px-6 py-4 border-2 border-slate-100 rounded-2xl hover:border-black hover:bg-slate-50 transition-all duration-300'
            >
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-black group-hover:text-white transition-colors duration-300'>
                  👤
                </div>
                <div className='text-left'>
                  <p className='text-sm font-bold text-slate-900'>Demo User</p>
                  <p className='text-[10px] text-slate-500 font-medium'>One-click exploration</p>
                </div>
              </div>
              <span className='text-slate-300 group-hover:text-black transition-colors'>⚡</span>
            </button>
          </div>

          <p className='mt-10 text-center text-slate-500 text-sm font-medium'>
            New to LetzGo?{' '}
            <Link to='/signup' className='font-black text-black hover:underline underline-offset-4 decoration-2'>
              Create Account
            </Link>
          </p>
        </div>

        <div className='bg-slate-50/50 p-6 border-t border-slate-100 text-center'>
          <Link
            to='/captain-login'
            className='text-xs font-bold text-emerald-600 hover:text-emerald-700 tracking-wider flex items-center justify-center gap-2 transition-colors uppercase'
          >
            Switch to Captain Mode <span className='text-lg'>🚀</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
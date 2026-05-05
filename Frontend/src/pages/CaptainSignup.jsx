import React, { useState, useRef, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import logo from '../assets/logoblack.png'

const CaptainSignup = () => {
  const navigate = useNavigate()
  const { setCaptain } = useContext(CaptainDataContext)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    vehicleColor: '',
    vehiclePlate: '',
    vehicleCapacity: '',
    vehicleType: ''
  })

  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(60)
  const [isLoading, setIsLoading] = useState(false)
  const timerRef = useRef(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.firstName.trim()) newErrors.firstName = "First name is required"
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!form.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Valid email is required"
    if (!form.password) newErrors.password = "Password is required"
    else if (form.password.length < 6) newErrors.password = "Min 6 characters"
    if (!form.vehicleColor.trim()) newErrors.vehicleColor = "Color required"
    if (!form.vehiclePlate.trim()) newErrors.vehiclePlate = "Plate required"
    if (!form.vehicleCapacity) newErrors.vehicleCapacity = "Capacity required"
    if (!form.vehicleType) newErrors.vehicleType = "Type required"
    return newErrors
  }

  const startTimer = () => {
    setTimer(60)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const captainData = {
    fullname: { firstname: form.firstName, lastname: form.lastName },
    email: form.email,
    password: form.password,
    vehicle: {
      color: form.vehicleColor,
      plate: form.vehiclePlate,
      capacity: form.vehicleCapacity,
      vehicleType: form.vehicleType
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    const validationErrors = validateForm()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captains/register`, captainData)
      if (response.status === 200) {
        setStep(2)
        startTimer()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError('')
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captains/register`, captainData)
      startTimer()
    } catch (err) {
      setError('Failed to resend OTP')
    }
  }

  const handleOtpVerify = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captains/verify-otp`, {
        email: form.email,
        otp
      })
      if (response.status === 201) {
        setCaptain(response.data.captain)
        localStorage.setItem('token', response.data.token)
        navigate('/captain-home')
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#F0FDF4]/30 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 font-sans'>
      <div className='w-full max-w-xl bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(16,185,129,0.1)] overflow-hidden border border-emerald-100 transition-all duration-700 hover:shadow-[0_48px_80px_-24px_rgba(16,185,129,0.15)]'>
        <div className='p-10 sm:p-14'>
          <div className='flex flex-col items-center mb-12 text-center'>
            <div className='bg-emerald-600 p-6 rounded-3xl mb-8 shadow-2xl shadow-emerald-600/30 transform hover:scale-105 transition-transform duration-500'>
              <img
                className="w-16 h-16 object-contain invert"
                src={logo}
                alt="LetzGo Logo"
              />
            </div>
            <h1 className='text-4xl font-black text-slate-900 tracking-tight mb-3'>
              {step === 1 ? 'Become a Captain' : 'Verify Email'}
            </h1>
            <p className='text-slate-400 text-lg font-medium max-w-xs'>
              {step === 1 ? 'Start your journey with LetzGo and earn more' : `Enter the 6-digit code sent to ${form.email}`}
            </p>
          </div>

        {step === 1 ? (
          <form onSubmit={submitHandler} className='space-y-6 flex-1'>
            {error && (
              <div className='bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl animate-in fade-in slide-in-from-top-2'>
                <p className='text-xs font-bold'>{error}</p>
              </div>
            )}

            <div className='space-y-5'>
              <p className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Name & Contact</p>
              <div className='grid grid-cols-2 gap-5'>
                <div className='group relative'>
                  <div className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors'>
                    <i className="ri-user-line text-lg"></i>
                  </div>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-5 py-4 rounded-2xl border transition-all outline-none font-bold text-slate-900 ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-slate-100 focus:border-emerald-600'}`}
                    placeholder='First Name'
                  />
                </div>
                <div className='group relative'>
                  <div className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors'>
                    <i className="ri-user-fill text-lg"></i>
                  </div>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-5 py-4 rounded-2xl border transition-all outline-none font-bold text-slate-900 ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-slate-100 focus:border-emerald-600'}`}
                    placeholder='Last Name'
                  />
                </div>
              </div>
              <div className='group relative'>
                <div className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors'>
                  <i className="ri-mail-line text-lg"></i>
                </div>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-5 py-4 rounded-2xl border transition-all outline-none font-bold text-slate-900 ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-100 focus:border-emerald-600'}`}
                  placeholder='Email Address'
                />
              </div>
              <div className='group relative'>
                <div className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors'>
                  <i className="ri-lock-2-line text-lg"></i>
                </div>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-5 py-4 rounded-2xl border transition-all outline-none font-bold text-slate-900 ${errors.password ? 'border-red-300 bg-red-50' : 'border-slate-100 focus:border-emerald-600'}`}
                  placeholder='Password'
                />
              </div>
            </div>

            <div className='space-y-5 pt-4'>
              <p className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Vehicle Details</p>
              <div className='grid grid-cols-2 gap-5'>
                <div className='group relative'>
                  <div className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors'>
                    <i className="ri-palette-line text-lg"></i>
                  </div>
                  <input
                    name="vehicleColor"
                    value={form.vehicleColor}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-5 py-4 rounded-2xl border transition-all outline-none font-bold text-slate-900 ${errors.vehicleColor ? 'border-red-300 bg-red-50' : 'border-slate-100 focus:border-emerald-600'}`}
                    placeholder='Color'
                  />
                </div>
                <div className='group relative'>
                  <div className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors'>
                    <i className="ri-hashtag text-lg"></i>
                  </div>
                  <input
                    name="vehiclePlate"
                    value={form.vehiclePlate}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-5 py-4 rounded-2xl border transition-all outline-none font-bold text-slate-900 ${errors.vehiclePlate ? 'border-red-300 bg-red-50' : 'border-slate-100 focus:border-emerald-600'}`}
                    placeholder='Plate'
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-5'>
                <div className='group relative'>
                  <div className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors'>
                    <i className="ri-group-line text-lg"></i>
                  </div>
                  <input
                    name="vehicleCapacity"
                    type="number"
                    value={form.vehicleCapacity}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-5 py-4 rounded-2xl border transition-all outline-none font-bold text-slate-900 ${errors.vehicleCapacity ? 'border-red-300 bg-red-50' : 'border-slate-100 focus:border-emerald-600'}`}
                    placeholder='Capacity'
                  />
                </div>
                <div className='group relative'>
                  <div className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors'>
                    <i className="ri-taxi-line text-lg"></i>
                  </div>
                  <select
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-5 py-4 rounded-2xl border transition-all outline-none font-bold text-slate-900 appearance-none ${errors.vehicleType ? 'border-red-300 bg-red-50' : 'border-slate-100 focus:border-emerald-600'}`}
                  >
                    <option value="" disabled>Type</option>
                    <option value="car">Car</option>
                    <option value="auto">Auto</option>
                    <option value="moto">Moto</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              disabled={isLoading}
              className='w-full bg-emerald-600 text-white font-black py-5 rounded-[24px] text-sm tracking-[0.2em] transition-all duration-500 hover:bg-emerald-700 hover:shadow-2xl hover:shadow-emerald-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-4 group mt-8'
            >
              {isLoading ? (
                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>CREATE ACCOUNT</span>
                  <span className='group-hover:translate-x-1.5 transition-transform'>→</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify} className='space-y-8 animate-in fade-in slide-in-from-bottom-4'>
            {error && (
              <div className='bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl'>
                <p className='text-xs font-bold'>{error}</p>
              </div>
            )}

            <div className='flex justify-center gap-2'>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className='w-full max-w-[200px] bg-white border-2 border-slate-100 focus:border-black text-center text-3xl font-black py-4 rounded-2xl outline-none tracking-[0.5em]'
                maxLength={6}
                placeholder="000000"
                autoFocus
              />
            </div>

            <div className="text-center">
              {timer > 0 ? (
                <p className="text-sm font-bold text-slate-400">Resend code in <span className="text-black">{timer}s</span></p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-sm font-black text-black underline underline-offset-4 decoration-2"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              disabled={isLoading}
              className='w-full bg-black text-white font-black py-4 rounded-2xl shadow-xl shadow-black/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3'
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>VERIFY & CONTINUE</span>
                  <i className="ri-checkbox-circle-line"></i>
                </>
              )}
            </button>
          </form>
        )}

          <p className='mt-12 text-center text-slate-500 text-sm font-medium'>
            Already have an account?{' '}
            <Link to='/captain-login' className='font-black text-emerald-600 hover:underline underline-offset-4 decoration-2'>
              Login here
            </Link>
          </p>
        </div>

        <div className='bg-slate-50/50 p-8 border-t border-slate-100'>
          <p className='text-[10px] text-slate-400 leading-relaxed text-center font-medium max-w-sm mx-auto'>
            By signing up, you agree to our 
            <span className='text-slate-900 font-bold'> Terms of Service</span> and 
            <span className='text-slate-900 font-bold'> Privacy Policy</span> apply.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CaptainSignup
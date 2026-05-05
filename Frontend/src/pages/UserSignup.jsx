import React, { useState, useContext,useRef} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import logo from '../assets/logoblack.png'


const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userData, setUserData] = useState({})
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60)
  const timerRef = useRef(null)
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  const { user, setUser } = useContext(UserDataContext)

  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    else if (firstName.trim().length < 3) newErrors.firstName = "First name must be at least 3 characters long";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    else if (lastName.trim().length < 3) newErrors.lastName = "Last name must be at least 3 characters long";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters long";
    return newErrors;
  };

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

  // Move newUser outside submitHandler so it can be reused for resend
  const newUser = {
    fullName: {
      firstName: firstName,
      lastName: lastName
    },
    email: email,
    password: password
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setError("Please fix the errors below.");
      return;
    }

    try {
      // Step 1: Send registration request to get OTP
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/register`, newUser);
      if (response.status === 200) {
        setStep(2);
        setError('');
        startTimer();
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message || 'Invalid request');
      } else if (err.response && err.response.status === 422) {
        setError(err.response.data.errors?.[0]?.msg || 'Validation error');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const handleResendOtp = async () => {
    setError('')
    setMessage('')
    try {
      // Use the same newUser object as registration
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/register`, newUser)
      setMessage('OTP resent to your email.')
      startTimer()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to resend OTP.')
    }
  }

  // OTP verification handler
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP.');
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/verify-otp`, {
        email,
        otp
      });
      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        navigate('/home');
        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setOtp('');
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Invalid OTP or server error. Please try again.'
      );
    }
  };

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
            <h1 className='text-4xl font-black text-slate-900 tracking-tight mb-3'>Create Account</h1>
            <p className='text-slate-400 text-lg font-medium max-w-xs'>Join LetzGo today and experience the future of mobility</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-2xl mb-8 animate-in fade-in slide-in-from-top-4 duration-300" role="alert">
              <div className='flex items-center gap-4'>
                <span className='text-2xl'>⚠️</span>
                <div>
                  <p className="font-bold text-sm uppercase tracking-wider">Registration Error</p>
                  <p className="text-xs opacity-90 mt-0.5">{error}</p>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={submitHandler} className='space-y-8'>
              <div className='space-y-3'>
                <label className='block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Full Name</label>
                <div className='flex gap-5'>
                  <div className="w-1/2 group relative">
                    <div className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors'>
                      <i className="ri-user-line text-lg"></i>
                    </div>
                    <input
                      required
                      className={`w-full pl-12 pr-5 py-4 rounded-2xl border transition-all duration-300 outline-none text-slate-900 font-medium ${
                        errors.firstName ? 'border-red-300 bg-red-50/30' : 'border-slate-200 group-hover:border-slate-300 focus:border-black focus:ring-4 focus:ring-black/5'
                      }`}
                      type="text"
                      placeholder='First name'
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    {errors.firstName && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold uppercase tracking-wider">{errors.firstName}</p>}
                  </div>
                  <div className="w-1/2 group relative">
                    <div className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors'>
                      <i className="ri-user-fill text-lg"></i>
                    </div>
                    <input
                      required
                      className={`w-full pl-12 pr-5 py-4 rounded-2xl border transition-all duration-300 outline-none text-slate-900 font-medium ${
                        errors.lastName ? 'border-red-300 bg-red-50/30' : 'border-slate-200 group-hover:border-slate-300 focus:border-black focus:ring-4 focus:ring-black/5'
                      }`}
                      type="text"
                      placeholder='Last name'
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    {errors.lastName && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold uppercase tracking-wider">{errors.lastName}</p>}
                  </div>
                </div>
              </div>

              <div className='group relative'>
                <label className='block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1'>Email Address</label>
                <div className='relative'>
                  <div className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors'>
                    <i className="ri-mail-line text-lg"></i>
                  </div>
                  <input
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-5 py-4 rounded-2xl border transition-all duration-300 outline-none text-slate-900 font-medium ${
                      errors.email ? 'border-red-300 bg-red-50/30' : 'border-slate-200 group-hover:border-slate-300 focus:border-black focus:ring-4 focus:ring-black/5'
                    }`}
                    type="email"
                    placeholder='name@example.com'
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold uppercase tracking-wider">{errors.email}</p>}
              </div>

              <div className='group relative'>
                <label className='block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1'>Password</label>
                <div className='relative'>
                  <div className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors'>
                    <i className="ri-lock-2-line text-lg"></i>
                  </div>
                  <input
                    className={`w-full pl-12 pr-5 py-4 rounded-2xl border transition-all duration-300 outline-none text-slate-900 font-medium ${
                      errors.password ? 'border-red-300 bg-red-50/30' : 'border-slate-200 group-hover:border-slate-300 focus:border-black focus:ring-4 focus:ring-black/5'
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    type="password"
                    placeholder='Min. 6 characters'
                  />
                </div>
                {errors.password && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold uppercase tracking-wider">{errors.password}</p>}
              </div>

              <button
                className='w-full bg-black text-white font-black py-5 rounded-[24px] text-sm tracking-[0.2em] transition-all duration-500 hover:bg-slate-800 hover:shadow-2xl hover:shadow-black/20 active:scale-[0.98] flex items-center justify-center gap-4 group mt-6'
              >
                <span>CREATE ACCOUNT</span>
                <span className='group-hover:translate-x-1.5 transition-transform'>→</span>
              </button>
            </form>
          )}

          {step === 2 && (
            <div className='space-y-10'>
              <form onSubmit={handleOtpVerify} className='space-y-8'>
                <div className='text-center'>
                  <h3 className='text-lg font-black text-slate-900 tracking-tight mb-2'>Verify your email</h3>
                  <p className='text-slate-400 text-sm font-medium'>We've sent a 6-digit code to {email}</p>
                </div>
                
                <div className='group'>
                  <input
                    className='w-full px-6 py-6 rounded-3xl border border-slate-200 text-center text-4xl font-black tracking-[0.5em] transition-all duration-300 outline-none focus:border-black focus:ring-8 focus:ring-black/5 placeholder:text-slate-100'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <div className="flex flex-col items-center gap-6">
                  {timer > 0 ? (
                    <div className='flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl'>
                      <div className='w-2 h-2 bg-slate-400 rounded-full animate-pulse' />
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Resend in {timer}s</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="text-xs font-black text-black hover:text-slate-600 uppercase tracking-widest underline underline-offset-8 decoration-2"
                      onClick={handleResendOtp}
                    >
                      Resend Verification Code
                    </button>
                  )}
                  
                  <button
                    className='w-full bg-black text-white font-black py-5 rounded-[24px] text-sm tracking-[0.2em] transition-all duration-500 hover:bg-slate-800 hover:shadow-2xl hover:shadow-black/20 active:scale-[0.98]'
                  >VERIFY & FINISH</button>
                </div>
              </form>
              
              {message && (
                <div className="bg-emerald-50 text-emerald-700 px-5 py-3 rounded-2xl text-center text-xs font-black uppercase tracking-wider animate-in fade-in duration-500">
                  {message}
                </div>
              )}
            </div>
          )}

          <p className='mt-12 text-center text-slate-500 text-sm font-medium'>
            Already have an account?{' '}
            <Link to='/login' className='font-black text-black hover:underline underline-offset-4 decoration-2'>
              Login here
            </Link>
          </p>
        </div>

        <div className='bg-slate-50/50 p-8 border-t border-slate-100'>
          <p className='text-[10px] text-slate-400 leading-relaxed text-center font-medium max-w-sm mx-auto'>
            This site is protected by reCAPTCHA and the 
            <span className='text-slate-900 font-bold'> Google Privacy Policy</span> and 
            <span className='text-slate-900 font-bold'> Terms of Service</span> apply.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserSignup

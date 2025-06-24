import React, { useState,useRef } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import logo from '../assets/logoblack.png'


const CaptainSignup = () => {

  const navigate = useNavigate()

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')

  const [ vehicleColor, setVehicleColor ] = useState('')
  const [ vehiclePlate, setVehiclePlate ] = useState('')
  const [ vehicleCapacity, setVehicleCapacity ] = useState('')
  const [ vehicleType, setVehicleType ] = useState('')

  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60)
    const timerRef = useRef(null)
    const [message, setMessage] = useState('')

  const { captain, setCaptain } = React.useContext(CaptainDataContext)

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
    if (!vehicleColor.trim()) newErrors.vehicleColor = "Vehicle color is required";
    else if (vehicleColor.trim().length < 3) newErrors.vehicleColor = "Vehicle color must be at least 3 characters long";
    if (!vehiclePlate.trim()) newErrors.vehiclePlate = "Vehicle plate is required";
    else if (vehiclePlate.trim().length < 3) newErrors.vehiclePlate = "Vehicle plate must be at least 3 characters long";
    if (!vehicleCapacity) newErrors.vehicleCapacity = "Vehicle capacity is required";
    else if (!Number(vehicleCapacity) || Number(vehicleCapacity) < 1) newErrors.vehicleCapacity = "Vehicle capacity must be a number greater than 0";
    if (!vehicleType) newErrors.vehicleType = "Vehicle type is required";
    else if (!['car', 'auto', 'moto'].includes(vehicleType)) newErrors.vehicleType = "Select a valid vehicle type";
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


  const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType
      }
    };


  const submitHandler = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setError("Please fix the errors below.");
      return;
    }

    

    try {
      // Step 1: Send registration request to get OTP
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captains/register`, captainData);

      if (response.status === 200) {
        setStep(2);
        setError('');
        startTimer();
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response?.data?.errors?.[0]?.msg || err.response.data.message || 'Something went wrong');
      } else {
        setError('Server error. Please try again later.');
      }
    }
  };

   const handleResendOtp = async () => {
      setError('')
      setMessage('')
      try {
        // Use the same newUser object as registration
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captains/register`, captainData)
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
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captains/verify-otp`, {
        email,
        otp
      });
      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        navigate('/captain-home');
        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setVehicleColor('');
        setVehiclePlate('');
        setVehicleCapacity('');
        setVehicleType('');
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
    <div className='py-5 px-5 h-screen flex flex-col justify-between'>
      <div>
        <img
          className="w-30 h-30 mx-auto object-contain "
          src={logo}
          alt="LetzGo Logo"
        />
        {step === 1 && (
          <form onSubmit={submitHandler}>
            {error && <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</p>}

            <h3 className='text-lg w-full  font-medium mb-2'>What's our Captain's name</h3>
            <div className='flex gap-4 mb-7'>
              <div className="w-1/2">
                <input
                  required
                  className='bg-[#eeeeee] w-full rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                  type="text"
                  placeholder='First name'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && <div className="text-red-600 text-xs mt-1">{errors.firstName}</div>}
              </div>
              <div className="w-1/2">
                <input
                  required
                  className='bg-[#eeeeee] w-full  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                  type="text"
                  placeholder='Last name'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && <div className="text-red-600 text-xs mt-1">{errors.lastName}</div>}
              </div>
            </div>

            <h3 className='text-lg font-medium mb-2'>What's our Captain's email</h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-[#eeeeee] mb-1 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="email"
              placeholder='email@example.com'
            />
            {errors.email && <div className="text-red-600 text-xs mb-2">{errors.email}</div>}

            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
            <input
              className='bg-[#eeeeee] mb-1 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required type="password"
              placeholder='password'
            />
            {errors.password && <div className="text-red-600 text-xs mb-2">{errors.password}</div>}

            <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
            <div className='flex gap-4 mb-7'>
              <div className="w-1/2">
                <input
                  required
                  className='bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                  type="text"
                  placeholder='Vehicle Color'
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                />
                {errors.vehicleColor && <div className="text-red-600 text-xs mt-1">{errors.vehicleColor}</div>}
              </div>
              <div className="w-1/2">
                <input
                  required
                  className='bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                  type="text"
                  placeholder='Vehicle Plate'
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                />
                {errors.vehiclePlate && <div className="text-red-600 text-xs mt-1">{errors.vehiclePlate}</div>}
              </div>
            </div>
            <div className='flex gap-4 mb-7'>
              <div className="w-1/2">
                <input
                  required
                  className='bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                  type="number"
                  placeholder='Vehicle Capacity'
                  value={vehicleCapacity}
                  onChange={(e) => setVehicleCapacity(e.target.value)}
                />
                {errors.vehicleCapacity && <div className="text-red-600 text-xs mt-1">{errors.vehicleCapacity}</div>}
              </div>
              <div className="w-1/2">
                <select
                  required
                  className='bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="" disabled>Select Vehicle Type</option>
                  <option value="car">Car</option>
                  <option value="auto">Auto</option>
                  <option value="moto">Moto</option>
                </select>
                {errors.vehicleType && <div className="text-red-600 text-xs mt-1">{errors.vehicleType}</div>}
              </div>
            </div>

            <button
              className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base cursor-pointer'
            >Create Captain Account</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleOtpVerify}>
            <h3 className='text-lg font-medium mb-2'>Enter OTP sent to your email</h3>
            <input
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              type="text"
              placeholder="Enter OTP"
            />
              <div className="flex items-center mb-4">
              <span className="text-xs text-gray-600">
                {timer > 0
                  ? `Resend OTP in ${timer}s`
                  : (
                    <button
                      type="button"
                      className="bg-black text-white p-2 rounded font-semibold"
                      onClick={handleResendOtp}
                    >
                      Resend OTP
                    </button>
                  )
                }
              </span>
            </div>
            <button
              className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base cursor-pointer'
            >Verify OTP</button>
          </form>
        )}
        <p className='text-center'>Already have a account? <Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
      </div>
      <div>
        <p className='text-[10px] mt-6 leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
          Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
      </div>
    </div>
  )
}

export default CaptainSignup
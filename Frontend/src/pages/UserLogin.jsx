import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'
import logo from '../assets/logoblack.png'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('') // 👈 Error state added
  const [errors, setErrors] = useState({})

  const { user, setUser } = useContext(UserDataContext)
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

    try {
      const userData = { email, password }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/login`, userData)

      console.log("User login response:", response.data)

      if (response.status === 200) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }

      setEmail('')
      setPassword('')
    } catch (err) {
    //   if (err.response && err.response.status === 401) {
    //     setError('Invalid email or password')
    //   } else if (err.response && err.response.data?.errors?.length > 0) {
    //     setError(err.response.data.errors[0].msg)
    //   } else {
    //     setError('Something went wrong. Please try again.')
    //   }
    // }
    if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login failed')
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img
          className="mx-auto w-30 h-30 object-contain "
          src={logo}
          alt="LetzGo Logo"
        />
        <form onSubmit={submitHandler}>
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
              {error}
            </div>
          )}

          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
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
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='bg-[#eeeeee] mb-1 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="password"
            placeholder='password'
          />
          {errors.password && <div className="text-red-600 text-xs mb-2">{errors.password}</div>}
          {/* Forgot Password link */}
          <div className="mb-7 text-right">
            <Link to="/user-forgot-password" className="text-blue-600 text-sm hover:underline">
              Forgot Password?
            </Link>
          </div>
          <button
            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
          >Login</button>
        </form>

        <p className='text-center'>New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link></p>
      </div>

      <div>
        <Link
          to='/captain-login'
          className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
        >Sign in as Captain</Link>
      </div>
    </div>
  )
}

export default UserLogin





// import React, { useState, useContext } from 'react'
// import { Link } from 'react-router-dom'
// import { UserDataContext } from '../context/UserContext'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'

// const UserLogin = () => {
//   const [ email, setEmail ] = useState('')
//   const [ password, setPassword ] = useState('')
//   const [ userData, setUserData ] = useState({})

//   const { user, setUser } = useContext(UserDataContext)
//   const navigate = useNavigate()



//   const submitHandler = async (e) => {
//     e.preventDefault();

//     const userData = {
//       email: email,
//       password: password
//     }

//     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/login`, userData)

//     if (response.status === 200) {
//       const data = response.data
//       setUser(data.user)
//       localStorage.setItem('token', data.token)
//       navigate('/home')
//     }


//     setEmail('')
//     setPassword('')
//   }

//   return (
//     <div className='p-7 h-screen flex flex-col justify-between'>
//       <div>
//         <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />

//         <form onSubmit={(e) => {
//           submitHandler(e)
//         }}>
//           <h3 className='text-lg font-medium mb-2'>What's your email</h3>
//           <input
//             required
//             value={email}
//             onChange={(e) => {
//               setEmail(e.target.value)
//             }}
//             className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
//             type="email"
//             placeholder='email@example.com'
//           />

//           <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

//           <input
//             className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
//             value={password}
//             onChange={(e) => {
//               setPassword(e.target.value)
//             }}
//             required type="password"
//             placeholder='password'
//           />

//           <button
//             className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
//           >Login</button>

//         </form>
//         <p className='text-center'>New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link></p>
//       </div>
//       <div>
//         <Link
//           to='/captain-login'
//           className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
//         >Sign in as Captain</Link>
//       </div>
//     </div>
//   )
// }

// export default UserLogin
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'
import logo from '../assets/logoblack.png'

const Captainlogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('') // 👈 for showing error messages

  const { captain, setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('') // reset error before new request

    try {
      const captainData = { email, password }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captains/login`, captainData)

      if (response.status === 200) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      }

      setEmail('')
      setPassword('')
    } catch (err) {
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
          className="w-30 h-30 object-contain "
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
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="password"
            placeholder='password'
          />
          {/* Forgot Password link */}
          <div className="mb-7 text-right">
            <Link to="/captain-forgot-password" className="text-blue-600 text-sm hover:underline">
              Forgot Password?
            </Link>
          </div>
          <button
            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
          >Login</button>
        </form>

        <p className='text-center'>Join a fleet? <Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link></p>
      </div>

      <div>
        <Link
          to='/login'
          className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
        >Sign in as User</Link>
      </div>
    </div>
  )
}

export default Captainlogin


// import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { CaptainDataContext } from '../context/CapatainContext'

// const Captainlogin = () => {

//   const [ email, setEmail ] = useState('')
//   const [ password, setPassword ] = useState('')

//   const { captain, setCaptain } = React.useContext(CaptainDataContext)
//   const navigate = useNavigate()



//   const submitHandler = async (e) => {
//     e.preventDefault();
//     const captain = {
//       email: email,
//       password
//     }
//     console.log(captain)
//     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captains/login`, captain)

//     if (response.status === 200) {
//       const data = response.data

//       setCaptain(data.captain)
//       localStorage.setItem('token', data.token)
//       navigate('/captain-home')

//     }

//     setEmail('')
//     setPassword('')
//   }
//   return (
//     <div className='p-7 h-screen flex flex-col justify-between'>
//       <div>
//         <img className='w-20 mb-3' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />

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
//         <p className='text-center'>Join a fleet? <Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link></p>
//       </div>
//       <div>
//         <Link
//           to='/login'
//           className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
//         >Sign in as User</Link>
//       </div>
//     </div>
//   )
// }

// export default Captainlogin
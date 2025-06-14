import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

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


  const { captain, setCaptain } = React.useContext(CaptainDataContext)

const validateForm = () => {
  if (firstName.trim().length < 3) return "First name must be at least 3 characters long";
  if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email";
  if (password.length < 6) return "Password must be at least 6 characters long";
  if (vehicleColor.trim().length < 3) return "Vehicle color must be at least 3 characters long";
  if (vehiclePlate.trim().length < 3) return "Vehicle plate must be at least 3 characters long";
  if (!Number(vehicleCapacity) || Number(vehicleCapacity) < 1) return "Vehicle capacity must be a number greater than 0";
  if (!['car', 'auto', 'motorcycle', 'bike'].includes(vehicleType)) return "Select a valid vehicle type";
  return null;
};

const submitHandler = async (e) => {
  e.preventDefault();

  const validationError = validateForm();
  if (validationError) {
    setError(validationError);
    return;
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

  try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captains/register`, captainData);

    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem('token', data.token);
      navigate('/captain-home');
    }

    // Clear form
    setEmail('');
    setFirstName('');
    setLastName('');
    setPassword('');
    setVehicleColor('');
    setVehiclePlate('');
    setVehicleCapacity('');
    setVehicleType('');
    setError('');

  } catch (err) {
    if (err.response && err.response.status === 400) {
      setError(err.response?.data?.errors?.[0]?.msg || err.response.data.message || 'Something went wrong');
    } else {
      setError('Server error. Please try again later.');
    }
  }
};


  return (
    <div className='py-5 px-5 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-20 mb-3' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />

        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          {error && <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</p>}

          <h3 className='text-lg w-full  font-medium mb-2'>What's our Captain's name</h3>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
              type="text"
              placeholder='First name'
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
              }}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
              type="text"
              placeholder='Last name'
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value)
              }}
            />
          </div>

          <h3 className='text-lg font-medium mb-2'>What's our Captain's email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

          <input
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            required type="password"
            placeholder='password'
          />

          <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Color'
              value={vehicleColor}
              onChange={(e) => {
                setVehicleColor(e.target.value)
              }}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Plate'
              value={vehiclePlate}
              onChange={(e) => {
                setVehiclePlate(e.target.value)
              }}
            />
          </div>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="number"
              placeholder='Vehicle Capacity'
              value={vehicleCapacity}
              onChange={(e) => {
                setVehicleCapacity(e.target.value)
              }}
            />
            <select
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              value={vehicleType}
              onChange={(e) => {
                setVehicleType(e.target.value)
              }}
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>

          <button
            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
          >Create Captain Account</button>

        </form>
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















// import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { CaptainDataContext } from '../context/CapatainContext'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'

// const CaptainSignup = () => {

//   const navigate = useNavigate()

//   const [ email, setEmail ] = useState('')
//   const [ password, setPassword ] = useState('')
//   const [ firstName, setFirstName ] = useState('')
//   const [ lastName, setLastName ] = useState('')

//   const [ vehicleColor, setVehicleColor ] = useState('')
//   const [ vehiclePlate, setVehiclePlate ] = useState('')
//   const [ vehicleCapacity, setVehicleCapacity ] = useState('')
//   const [ vehicleType, setVehicleType ] = useState('')


//   const { captain, setCaptain } = React.useContext(CaptainDataContext)


//   const submitHandler = async (e) => {
//     e.preventDefault()
//     const captainData = {
//       fullname: {
//         firstname: firstName,
//         lastname: lastName
//       },
//       email: email,
//       password: password,
//       vehicle: {
//         color: vehicleColor,
//         plate: vehiclePlate,
//         capacity: vehicleCapacity,
//         vehicleType: vehicleType
//       }
//     }
//     // console.log(captainData)
    
//     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captains/register`, captainData)

//     if (response.status === 201) {
//       const data = response.data
//       setCaptain(data.captain)
//       localStorage.setItem('token', data.token)
//       navigate('/captain-home')
//     }

//     setEmail('')
//     setFirstName('')
//     setLastName('')
//     setPassword('')
//     setVehicleColor('')
//     setVehiclePlate('')
//     setVehicleCapacity('')
//     setVehicleType('')

//   }
//   return (
//     <div className='py-5 px-5 h-screen flex flex-col justify-between'>
//       <div>
//         <img className='w-20 mb-3' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />

//         <form onSubmit={(e) => {
//           submitHandler(e)
//         }}>

//           <h3 className='text-lg w-full  font-medium mb-2'>What's our Captain's name</h3>
//           <div className='flex gap-4 mb-7'>
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
//               type="text"
//               placeholder='First name'
//               value={firstName}
//               onChange={(e) => {
//                 setFirstName(e.target.value)
//               }}
//             />
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
//               type="text"
//               placeholder='Last name'
//               value={lastName}
//               onChange={(e) => {
//                 setLastName(e.target.value)
//               }}
//             />
//           </div>

//           <h3 className='text-lg font-medium mb-2'>What's our Captain's email</h3>
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

//           <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
//           <div className='flex gap-4 mb-7'>
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               type="text"
//               placeholder='Vehicle Color'
//               value={vehicleColor}
//               onChange={(e) => {
//                 setVehicleColor(e.target.value)
//               }}
//             />
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               type="text"
//               placeholder='Vehicle Plate'
//               value={vehiclePlate}
//               onChange={(e) => {
//                 setVehiclePlate(e.target.value)
//               }}
//             />
//           </div>
//           <div className='flex gap-4 mb-7'>
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               type="number"
//               placeholder='Vehicle Capacity'
//               value={vehicleCapacity}
//               onChange={(e) => {
//                 setVehicleCapacity(e.target.value)
//               }}
//             />
//             <select
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               value={vehicleType}
//               onChange={(e) => {
//                 setVehicleType(e.target.value)
//               }}
//             >
//               <option value="" disabled>Select Vehicle Type</option>
//               <option value="car">Car</option>
//               <option value="auto">Auto</option>
//               <option value="bike">Bike</option>
//             </select>
//           </div>

//           <button
//             className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
//           >Create Captain Account</button>

//         </form>
//         <p className='text-center'>Already have a account? <Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
//       </div>
//       <div>
//         <p className='text-[10px] mt-6 leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
//           Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
//       </div>
//     </div>
//   )
// }

// export default CaptainSignup
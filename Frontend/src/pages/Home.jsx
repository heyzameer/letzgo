import React, { useContext, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';


const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setconfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [WaitingForDriverState, setWaitingForDriver] = useState(false);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null)
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const WaitingForDriverRef = useRef(null);

  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [activeField, setActiveField] = useState(null)

  const [fare, setFare] = useState({});
  const [ride, setRide] = useState(null);

  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const userContext = useContext(UserDataContext);

  const user = userContext?.user;

  useEffect(() => {
    console.log("User complete data:", user);
    socket.emit('join', { userType: "user", userId: user?.user?._id });
  }, [user]);


  // useEffect(() => {
  //   console.log("User complete data:", user);
  //   // FIX: user._id, not user?.user._id
  //   if (user && user._id) {
  //     socket.emit("join", { userType: "user", userId: user._id });
  //   }
  // }, [user]);

  socket.on('ride-confirmed', (ride) => {
    console.log("ride-confirmed receivedd:", ride);
    setWaitingForDriver(true);
    setVehicleFound(false);
    setRide(ride);
  });

  socket.on('ride-started', ride => {
    console.log("ride")
    setWaitingForDriver(false)
    navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
  })


  const handlePickupChange = async (e) => {
    setPickup(e.target.value)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestions`, {
        params: { input: e.target.value },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }

      })
      setPickupSuggestions(response.data)
      console.log(response.data)
    } catch {
      // handle error
    }
  }

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestions`, {
        params: { input: e.target.value },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setDestinationSuggestions(response.data)
      console.log(response.data)
    } catch {
      // handle error
    }
  }


  async function findTrip() {
    if (pickup && destination) {
      setVehiclePanel(true)
      setPanelOpen(false)
    }


    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/ride/get-fare`, {
      params: { pickup, destination },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    console.log(response.data)
    setFare(response.data)
  }


  async function createRide() {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/ride/create`, {
      pickup,
      destination,
      vehicleType
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log(response.data);
  }

  const submitHandler = (e) => {
    e.preventDefault()
  }


  useGSAP(() => {
    if (panelRef.current) {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: '70%',
          padding: 24,
          duration: 0.1,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
          duration: 0.1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: '0%',
          padding: 0,
          duration: 0.1,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
          duration: 0.1,
        });
      }
    }
  }, [panelOpen]);

  useGSAP(function () {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehiclePanel])

  useGSAP(function () {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [confirmRidePanel])

  useGSAP(function () {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehicleFound])

  useGSAP(function () {
    if (WaitingForDriverState) {
      gsap.to(WaitingForDriverRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(WaitingForDriverRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [WaitingForDriverState])

  // Logout handler
  const handleLogout = async () => {
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

  return (
    <div className='relative  h-screen overflow-hidden'>
    

      <div className='h-4/5 z-0'>
        <LiveTracking />
      </div>

      <div className='flex flex-col justify-end h-screen absolute top-0 w-full z-10'>
      {/* <div className='flex flex-col justify-end h-screen absolute top-0 w-full z-10'> */}
        <div className='h-[30%] p-6 bg-white relative'>
          {/* Profile icon: show only when panel is down (panelOpen is false) */}
           {!panelOpen && (
            <i
              className="ri-logout-box-line text-2xl absolute right-6 top-6 cursor-pointer"
              style={{ color: '#222' }}
              onClick={handleLogout}
            ></i>
          )}
          
          {!panelOpen && (
            <i
              className="ri-profile-line text-2xl absolute right-18 top-6 cursor-pointer"
              style={{ color: '#222' }}
              onClick={() => navigate('/user-profile')}
            ></i>
          )}

         
          {/* Down arrow: show only when panel is up (panelOpen is true) */}
          {panelOpen && (
            <h5
              ref={panelCloseRef}
              onClick={() => setPanelOpen(false)}
              className='absolute right-6 top-6 text-2xl cursor-pointer opacity-100'
            >
              <i className="ri-arrow-down-wide-line"></i>
            </h5>
          )}
          <h4 className='text-2xl font-semibold'>Find a trip</h4>
          <form className='relative py-3' onSubmit={submitHandler}>
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true)
                setActiveField('pickup')
              }}
              value={pickup}
              onChange={handlePickupChange}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
              type="text"
              placeholder='Add a pick-up location'
            />
            <input
              onClick={() => {
                setPanelOpen(true)
                setActiveField('destination')
              }}
              value={destination}
              onChange={handleDestinationChange}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
              type="text"
              placeholder='Enter your destination' />
          </form>
          {panelOpen && <button
            onClick={findTrip}
            className='bg-black text-white px-4 py-2 rounded-lg mt-1 w-full transition-all duration-2000'>
            Find Trip
          </button>}
        </div>
        <div ref={panelRef} className='bg-white h-0 overflow-auto transition-all duration-500 '>
          <LocationSearchPanel
            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>

      <div ref={vehiclePanelRef} className='fixed h-screen  z-10 bg-white bottom-0  px-3 py-8 pt-12'>
        <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setconfirmRidePanel} setVehiclePanel={setVehiclePanel} />
      </div>

      <div ref={confirmRidePanelRef} className='fixed h-screen z-10 bg-white bottom-0  px-3 py-6 pt-12'>
        <ConfirmRide
          pickup={pickup}
          destination={destination}
          vehicleType={vehicleType}
          fare={fare}
          createRide={createRide}
          setConfirmRidePanel={setconfirmRidePanel}
          setVehicleFound={setVehicleFound} />
      </div>

      <div ref={vehicleFoundRef} className='fixed h-screen
       z-10 bg-white bottom-0  px-3 py-6 pt-12'>
        <LookingForDriver pickup={pickup}
          destination={destination}
          vehicleType={vehicleType}
          fare={fare} setVehicleFound={setVehicleFound} />
      </div>

      <div ref={WaitingForDriverRef} className='fixed z-10 bg-white bottom-0  px-3 py-6 pt-12'>
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver}
          ride={ride}
          vehicleType={vehicleType} />
      </div>
    </div>
  );
};

export default Home;
// import React, { useContext, useEffect, useRef, useState } from 'react';
// import gsap from 'gsap';
// import { useGSAP } from '@gsap/react';
// import 'remixicon/fonts/remixicon.css'
// import LocationSearchPanel from '../components/LocationSearchPanel';
// import VehiclePanel from '../components/VehiclePanel';
// import ConfirmRide from '../components/ConfirmRide';
// import LookingForDriver from '../components/LookingForDriver';
// import WaitingForDriver from '../components/WaitingForDriver';
// import axios from 'axios';
// import { SocketContext } from '../context/SocketContext';
// import { UserDataContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import LiveTracking from '../components/LiveTracking';


// const Home = () => {
//   const [pickup, setPickup] = useState("");
//   const [destination, setDestination] = useState("");
//   const [vehicleType, setVehicleType] = useState(null);
//   const [panelOpen, setPanelOpen] = useState(false);
//   const [vehiclePanel, setVehiclePanel] = useState(false);
//   const [confirmRidePanel, setconfirmRidePanel] = useState(false);
//   const [vehicleFound, setVehicleFound] = useState(false);
//   const [WaitingForDriverState, setWaitingForDriver] = useState(false);

//   const panelRef = useRef(null);
//   const panelCloseRef = useRef(null)
//   const vehiclePanelRef = useRef(null);
//   const confirmRidePanelRef = useRef(null);
//   const vehicleFoundRef = useRef(null);
//   const WaitingForDriverRef = useRef(null);

//   const [pickupSuggestions, setPickupSuggestions] = useState([])
//   const [destinationSuggestions, setDestinationSuggestions] = useState([])
//   const [activeField, setActiveField] = useState(null)

//   const [fare, setFare] = useState({});
//   const [ride, setRide] = useState(null);

//   const navigate = useNavigate();

//   const { socket } = useContext(SocketContext);
//   const userContext = useContext(UserDataContext);
//   const user = userContext?.user;

//   useEffect(() => {
//     console.log("User complete data:", user);
//     socket.emit('join', { userType: "user", userId: user?.user._id });
//   }, [user]);

//   socket.on('ride-confirmed', (ride) => {
//     console.log("ride-confirmed received:", ride);
//     setWaitingForDriver(true);
//     setVehicleFound(false);
//     setRide(ride);
//   });

//   socket.on('ride-started', ride => {
//     console.log("ride")
//     setWaitingForDriver(false)
//     navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
//   })


//   const handlePickupChange = async (e) => {
//     setPickup(e.target.value)
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestions`, {
//         params: { input: e.target.value },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }

//       })
//       setPickupSuggestions(response.data)
//       console.log(response.data)
//     } catch {
//       // handle error
//     }
//   }

//   const handleDestinationChange = async (e) => {
//     setDestination(e.target.value)
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestions`, {
//         params: { input: e.target.value },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       })
//       setDestinationSuggestions(response.data)
//       console.log(response.data)
//     } catch {
//       // handle error
//     }
//   }


//   async function findTrip() {
//     if (pickup && destination) {
//       setVehiclePanel(true)
//       setPanelOpen(false)
//     }


//     const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/ride/get-fare`, {
//       params: { pickup, destination },
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`
//       }
//     })

//     console.log(response.data)
//     setFare(response.data)
//   }


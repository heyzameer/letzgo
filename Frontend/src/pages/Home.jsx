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
import UserRideHistoryPanel from '../components/UserRideHistoryPanel';
import useUserLogout from '../hooks/useUserLogout';
import useSuggestions from '../hooks/useSuggestions';
import useFare from '../hooks/useFare';
import useCreateRide from '../hooks/useCreateRide';


const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setconfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [WaitingForDriverState, setWaitingForDriver] = useState(false);
  const [cancelMessage, setCancelMessage] = useState(null);
  const [historyPanelOpen, setHistoryPanelOpen] = useState(false);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null)
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const WaitingForDriverRef = useRef(null);

  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [activeField, setActiveField] = useState(null)

  // Use custom hooks for suggestions
  const pickupSuggestionsHook = useSuggestions();
  const destinationSuggestionsHook = useSuggestions();


  // Use custom hook for logout
  const logout = useUserLogout();
  const { fare, getFare } = useFare();
  const { createRide } = useCreateRide();
  // State for ride data
  const [ride, setRide] = useState(null);

  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const userContext = useContext(UserDataContext);

  const user = userContext?.user;

  useEffect(() => {
    // console.log("User complete data:", user);
    socket.emit('join', { userType: "user", userId: user?.user?._id });
    setCancelMessage(null);
  }, [user]);

  useEffect(() => {
    socket.on('ride-confirmed', (ride) => {
      // console.log("ride-confirmed receivedd:", ride);
      setWaitingForDriver(true);
      setVehicleFound(false);
      setRide(ride);
      setCancelMessage(null);
    });

    socket.on('ride-started', ride => {
      // console.log("ride")
      setWaitingForDriver(false)
      navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
    });

    // Handle captain cancellation: return user to confirm ride panel
    socket.on('ride-cancelled-by-captain', (data) => {
      // console.log("ride-cancelled-by-captain:", data);
      setWaitingForDriver(false);
      setVehicleFound(false);
      setCancelMessage("The captain cancelled your ride. Please confirm again or wait for another captain.");
      setconfirmRidePanel(true);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('ride-confirmed');
      socket.off('ride-started');
      socket.off('ride-cancelled-by-captain');
    };
  }, [socket, navigate]);



  // Suggestions handlers using custom hook
  const handlePickupChange = (e) => {
    setPickup(e.target.value);
    pickupSuggestionsHook.getSuggestions(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    destinationSuggestionsHook.getSuggestions(e.target.value);
  };



  // Find trip using custom hook for fare
  async function findTrip() {
    if (pickup && destination) {
      setVehiclePanel(true)
      setPanelOpen(false)
    }
    await getFare(pickup, destination);
  }

  // Use custom hook to create ride
  async function handleCreateRide() {
    await createRide({ pickup, destination, vehicleType });
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

  return (
    <div className='relative  h-screen overflow-hidden'>


      <div className='h-4/5 z-0'>
        <LiveTracking />
      </div>

      <div className='flex flex-col justify-end h-screen absolute top-0 w-full z-10'>
        <div className='h-[30%] p-6 bg-white relative'>
          {/* Profile icon: show only when panel is down (panelOpen is false) */}
          {!panelOpen && (
            <>
              <i
                className="ri-logout-box-line text-2xl absolute right-6 top-6 cursor-pointer"
                style={{ color: '#222' }}
                onClick={logout}
              ></i>
              <i
                className="ri-profile-line text-2xl absolute right-18 top-6 cursor-pointer"
                style={{ color: '#222' }}
                onClick={() => navigate('/user-profile')}
              ></i>
              {/* History icon */}
              <i
                className="ri-history-line text-2xl absolute right-32 top-6 cursor-pointer"
                style={{ color: '#222' }}
                onClick={() => setHistoryPanelOpen(true)}
                title="View Ride History"
              ></i>
            </>
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
        <div ref={panelRef} className='bg-white h-0 overflow-auto  transition-all duration-500 '>
          <LocationSearchPanel
            suggestions={activeField === 'pickup' ? pickupSuggestionsHook.suggestions : destinationSuggestionsHook.suggestions}
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>

      <div ref={vehiclePanelRef} className='fixed h-screen  z-10 bg-white bottom-0 rounded-3xl  px-3 py-8 pt-12'>
        <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setconfirmRidePanel} setVehiclePanel={setVehiclePanel} />
      </div>

      <div ref={confirmRidePanelRef} className='fixed h-screen z-10 bg-white bottom-0 rounded-3xl px-3 py-6 pt-12'>
        <ConfirmRide
          pickup={pickup}
          destination={destination}
          vehicleType={vehicleType}
          fare={fare}
          createRide={handleCreateRide}
          setConfirmRidePanel={setconfirmRidePanel}
          setVehicleFound={setVehicleFound}
          cancelMessage={cancelMessage}
        />
      </div>

      <div ref={vehicleFoundRef} className='fixed h-screen
       z-10 bg-white bottom-0  px-3 py-6 pt-12 rounded-3xl'>
        <LookingForDriver pickup={pickup}
          destination={destination}
          vehicleType={vehicleType}
          fare={fare} setVehicleFound={setVehicleFound} />
      </div>

      <div ref={WaitingForDriverRef} className='fixed z-10 bg-white bottom-0  px-3 py-6 pt-12 rounded-3xl'>
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver}
          ride={ride}
          setVehicleFound={setVehicleFound}
          vehicleType={vehicleType} />
      </div>

      <UserRideHistoryPanel open={historyPanelOpen} setOpen={setHistoryPanelOpen} />
    </div>
  );
};

export default Home;
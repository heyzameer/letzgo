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
import UserLayout from '../components/UserLayout';
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

  const panelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const WaitingForDriverRef = useRef(null);
  const backdropRef = useRef(null);

  const [activeField, setActiveField] = useState(null)

  const pickupSuggestionsHook = useSuggestions();
  const destinationSuggestionsHook = useSuggestions();

  const { fare, getFare } = useFare();
  const { createRide } = useCreateRide();
  const [ride, setRide] = useState(null);

  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    if (user?.user?._id) {
        socket.emit('join', { userType: "user", userId: user.user._id });
    }
  }, [user]);

  useEffect(() => {
    socket.on('ride-confirmed', (ride) => {
      setWaitingForDriver(true);
      setVehicleFound(false);
      setRide(ride);
      setCancelMessage(null);
    });

    socket.on('ride-started', ride => {
      setWaitingForDriver(false)
      navigate('/riding', { state: { ride } }) 
    });

    socket.on('ride-cancelled-by-captain', (data) => {
      setWaitingForDriver(false);
      setVehicleFound(false);
      setCancelMessage("The captain cancelled your ride. Please confirm again.");
      setconfirmRidePanel(true);
    });

    return () => {
      socket.off('ride-confirmed');
      socket.off('ride-started');
      socket.off('ride-cancelled-by-captain');
    };
  }, [socket, navigate]);

  const handlePickupChange = (e) => {
    setPickup(e.target.value);
    pickupSuggestionsHook.getSuggestions(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    destinationSuggestionsHook.getSuggestions(e.target.value);
  };

  async function findTrip() {
    if (pickup && destination) {
      setVehiclePanel(true)
      setPanelOpen(false)
      await getFare(pickup, destination);
    }
  }

  async function handleCreateRide() {
    await createRide({ pickup, destination, vehicleType });
  }

  const isAnyPanelOpen = vehiclePanel || confirmRidePanel || vehicleFound || WaitingForDriverState;

  useGSAP(() => {
    if (isAnyPanelOpen) {
      gsap.to(backdropRef.current, { opacity: 1, display: 'block', duration: 0.3 });
    } else {
      gsap.to(backdropRef.current, { opacity: 0, display: 'none', duration: 0.3 });
    }
  }, [isAnyPanelOpen]);

  const animatePanel = (ref, isOpen) => {
    if (ref.current) {
      gsap.to(ref.current, {
        y: isOpen ? '0%' : '100%',
        duration: 0.5,
        ease: 'power4.out'
      });
    }
  };

  useGSAP(() => { animatePanel(vehiclePanelRef, vehiclePanel); }, [vehiclePanel]);
  useGSAP(() => { animatePanel(confirmRidePanelRef, confirmRidePanel); }, [confirmRidePanel]);
  useGSAP(() => { animatePanel(vehicleFoundRef, vehicleFound); }, [vehicleFound]);
  useGSAP(() => { animatePanel(WaitingForDriverRef, WaitingForDriverState); }, [WaitingForDriverState]);

  return (
    <UserLayout>
      <div className='h-full relative overflow-hidden flex flex-col lg:flex-row'>
        
        {/* Map Area */}
        <div className='flex-1 relative z-0 min-h-[40vh] lg:min-h-0'>
          <LiveTracking />
          
          {/* Search Card Overlay (Desktop) */}
          <div className='hidden lg:block absolute top-10 left-10 w-[450px] z-20'>
            <div className='bg-white rounded-[40px] shadow-2xl shadow-black/10 p-10 border border-slate-100'>
              <h2 className='text-3xl font-black text-slate-900 tracking-tight mb-8'>Where to?</h2>
              
              <div className='relative space-y-4'>
                 <div className="absolute left-6 top-8 bottom-24 w-0.5 bg-slate-100 rounded-full z-0" />
                 
                 <div className='relative'>
                   <div className='absolute left-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300 z-10' />
                   <input
                     onClick={() => { setPanelOpen(true); setActiveField('pickup'); }}
                     value={pickup}
                     onChange={handlePickupChange}
                     className='w-full bg-slate-50 border-none rounded-[24px] pl-14 pr-6 py-5 font-bold text-slate-900 focus:ring-2 focus:ring-black/5 transition-all outline-none placeholder:text-slate-400'
                     placeholder='Add a pickup location'
                   />
                 </div>

                 <div className='relative'>
                   <div className='absolute left-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-sm bg-black z-10' />
                   <input
                     onClick={() => { setPanelOpen(true); setActiveField('destination'); }}
                     value={destination}
                     onChange={handleDestinationChange}
                     className='w-full bg-slate-50 border-none rounded-[24px] pl-14 pr-6 py-5 font-bold text-slate-900 focus:ring-2 focus:ring-black/5 transition-all outline-none placeholder:text-slate-400'
                     placeholder='Enter destination'
                   />
                 </div>

                 {panelOpen && (
                    <div className='pt-4 max-h-[300px] overflow-y-auto scrollbar-hide animate-in fade-in slide-in-from-top-2'>
                        <LocationSearchPanel
                            suggestions={activeField === 'pickup' ? pickupSuggestionsHook.suggestions : destinationSuggestionsHook.suggestions}
                            setPanelOpen={setPanelOpen}
                            setVehiclePanel={setVehiclePanel}
                            setPickup={setPickup}
                            setDestination={setDestination}
                            activeField={activeField}
                        />
                    </div>
                 )}

                 <button 
                   onClick={findTrip}
                   disabled={!pickup || !destination}
                   className='w-full bg-black text-white font-black py-5 rounded-[24px] shadow-xl shadow-black/20 mt-6 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30'
                 >
                    <span>SEARCH RIDES</span>
                    <i className="ri-arrow-right-line"></i>
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Booking Panel */}
        <div className='lg:hidden bg-white rounded-t-[40px] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)] p-8 relative z-10 -mt-10'>
          <div className='w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8' />
          
          <h2 className='text-2xl font-black text-slate-900 tracking-tight mb-8'>Ready to go?</h2>

          <div className='space-y-4 mb-8'>
             <div className='relative'>
               <i className="ri-map-pin-user-fill absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
               <input 
                 value={pickup}
                 onChange={handlePickupChange}
                 onClick={() => { setPanelOpen(true); setActiveField('pickup'); }}
                 className='w-full bg-slate-50 rounded-2xl pl-12 pr-4 py-4 font-bold text-sm outline-none border border-slate-100' 
                 placeholder='Pick-up Location' 
               />
             </div>
             <div className='relative'>
               <i className="ri-map-pin-2-fill absolute left-5 top-1/2 -translate-y-1/2 text-slate-900"></i>
               <input 
                 value={destination}
                 onChange={handleDestinationChange}
                 onClick={() => { setPanelOpen(true); setActiveField('destination'); }}
                 className='w-full bg-slate-50 rounded-2xl pl-12 pr-4 py-4 font-bold text-sm outline-none border border-slate-100' 
                 placeholder='Where to?' 
               />
             </div>
          </div>

          <button 
            onClick={findTrip}
            className='w-full bg-black text-white font-black py-5 rounded-[22px] shadow-xl shadow-black/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all'
          >
            <span>FIND RIDES</span>
            <i className="ri-search-2-line"></i>
          </button>
        </div>

        {/* Mobile Suggestions Panel */}
        {panelOpen && (
            <div className='lg:hidden fixed inset-0 bg-white z-[60] p-6 animate-in slide-in-from-bottom duration-300'>
                <div className='flex items-center justify-between mb-8'>
                    <h3 className='text-xl font-black'>Search {activeField}</h3>
                    <button onClick={() => setPanelOpen(false)} className='w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center'>
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>
                <div className='relative mb-8'>
                    <input 
                        autoFocus
                        value={activeField === 'pickup' ? pickup : destination}
                        onChange={activeField === 'pickup' ? handlePickupChange : handleDestinationChange}
                        className='w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none border-2 border-black'
                        placeholder='Type location...'
                    />
                </div>
                <LocationSearchPanel
                    suggestions={activeField === 'pickup' ? pickupSuggestionsHook.suggestions : destinationSuggestionsHook.suggestions}
                    setPanelOpen={setPanelOpen}
                    setVehiclePanel={setVehiclePanel}
                    setPickup={setPickup}
                    setDestination={setDestination}
                    activeField={activeField}
                />
            </div>
        )}

        {/* Ride Flow Panels */}
        <div 
          ref={backdropRef}
          className='fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 hidden opacity-0'
          onClick={() => {
            setVehiclePanel(false);
            setconfirmRidePanel(false);
            setVehicleFound(false);
            setWaitingForDriver(false);
          }}
        />

        <div ref={vehiclePanelRef} className='fixed bottom-0 left-1/2 -translate-x-1/2 w-full lg:w-[500px] z-50 bg-white rounded-t-[40px] shadow-2xl translate-y-full will-change-transform'>
          <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setconfirmRidePanel} setVehiclePanel={setVehiclePanel} />
        </div>

        <div ref={confirmRidePanelRef} className='fixed bottom-0 left-1/2 -translate-x-1/2 w-full lg:w-[500px] z-50 bg-white rounded-t-[40px] shadow-2xl translate-y-full will-change-transform'>
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

        <div ref={vehicleFoundRef} className='fixed bottom-0 left-1/2 -translate-x-1/2 w-full lg:w-[500px] z-50 bg-white rounded-t-[40px] shadow-2xl translate-y-full will-change-transform'>
          <LookingForDriver 
            pickup={pickup}
            destination={destination}
            vehicleType={vehicleType}
            fare={fare} 
            setVehicleFound={setVehicleFound} 
          />
        </div>

        <div ref={WaitingForDriverRef} className='fixed bottom-0 left-1/2 -translate-x-1/2 w-full lg:w-[500px] z-50 bg-white rounded-t-[40px] shadow-2xl translate-y-full will-change-transform'>
          <WaitingForDriver 
            setWaitingForDriver={setWaitingForDriver}
            ride={ride}
            setVehicleFound={setVehicleFound}
            vehicleType={vehicleType} 
          />
        </div>

      </div>
    </UserLayout>
  );
};

export default Home;
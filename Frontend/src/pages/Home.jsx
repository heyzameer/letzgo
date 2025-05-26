import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setconfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [WaitingForDriverState, setWaitingForDriver] = useState(true);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null)
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const WaitingForDriverRef = useRef(null);



  const submitHandler = (e) => {
    e.preventDefault();
  };

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
    <div className='relative h-screen overflow-hidden'>
      <img
        className='w-16 absolute left-5 top-5'
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt="Uber logo"
      />

      <div className='h-screen w-screen'>
        <img
          src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif'
          alt="Background"
          className='w-full h-screen object-cover'
        />
      </div>

      <div className='flex flex-col justify-end h-screen absolute top-0 w-full'>
        <div className='h-[30%] p-6 bg-white'>
          <h5 ref={panelCloseRef} onClick={() => {
            setPanelOpen(false)
          }} className='absolute opacity-0 right-6 top-6 text-2xl'>
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className='text-2xl font-semibold'>Find a trip</h4>
          <form className='relative py-3' onSubmit={(e) => {
            submitHandler(e)
          }}>
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true)
                // setActiveField('pickup')
              }}
              value={pickup}
              // onChange={handlePickupChange}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
              type="text"
              placeholder='Add a pick-up location'
            />
            <input
              onClick={() => {
                setPanelOpen(true)
                // setActiveField('destination')
              }}
              value={destination}
              // onChange={handleDestinationChange}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
              type="text"
              placeholder='Enter your destination' />
          </form>
        </div>

        <div
          ref={panelRef}
          className='bg-white h-0 overflow-hidden transition-all duration-500'
        >
            <LocationSearchPanel vehiclePanel={vehiclePanel} setVehiclePanel={setVehiclePanel} panelOpen={panelOpen} setPanelOpen={setPanelOpen} />
        </div>
      </div>


      <div ref={vehiclePanelRef} className='fixed w-full z-10 bg-white bottom-0  px-3 py-8 pt-12'>
        <VehiclePanel setConfirmRidePanel={setconfirmRidePanel} setVehiclePanel={setVehiclePanel} />
      </div>

      <div ref={confirmRidePanelRef} className='fixed w-full z-10 bg-white bottom-0  px-3 py-6 pt-12'>
        <ConfirmRide setConfirmRidePanel={setconfirmRidePanel} setVehicleFound={setVehicleFound} />
      </div>

      <div ref={vehicleFoundRef} className='fixed w-full z-10 bg-white bottom-0  px-3 py-6 pt-12'>
        <LookingForDriver setVehicleFound={setVehicleFound} />
      </div>

      <div ref={WaitingForDriverRef} className='fixed w-full z-10 bg-white bottom-0  px-3 py-6 pt-12'>
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  );
};

export default Home;

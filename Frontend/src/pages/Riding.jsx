import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'
import NavigationMap from '../components/NavigationMap'
import car from '../assets/car.jpg'
import auto from '../assets/auto.jpg'
import bike from '../assets/moto.jpg'
import axios from 'axios'
import gsap from 'gsap'

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Riding = () => {
  const location = useLocation();
  const ride = location.state?.ride;
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [isRideEnded, setIsRideEnded] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    socket.on('ride-ended', (data) => {
      setIsRideEnded(true);
    });
    return () => socket.off('ride-ended');
  }, [socket]);

  const handlePayment = async () => {
    await loadRazorpayScript();
    const amount = ride?.fare || 100;
    try {
      const orderRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/ride/create-order`, { amount }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const order = orderRes.data;
      if (!order.id) {
        alert("Failed to create order");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "LetzGo Ride Payment",
        description: "Complete your ride payment",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/ride/verify-payment`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            rideId: ride._id
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });

          if (verifyRes.status === 200) {
            setIsPaid(true);
            socket.emit('payment-success', { rideId: ride._id });
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          email: ride?.user?.email,
          name: ride?.user?.fullName?.firstName
        },
        theme: { color: "#10b981" } // Emerald-500
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const handleCashPayment = () => {
    setIsPaid(true);
    socket.emit('payment-success', { rideId: ride._id });
  };

  let vehicleImg = car;
  const vType = ride?.captain?.vehicle?.vehicleType;
  if (vType === 'auto') vehicleImg = auto;
  if (['moto', 'motorcycle', 'bike'].includes(vType)) vehicleImg = bike;

  const [currentCoords, setCurrentCoords] = useState(null);
  const destinationCoords = ride?.destinationLocation
    ? { lat: ride.destinationLocation.ltd, lng: ride.destinationLocation.lng }
    : null;

  useEffect(() => {
    const fetchCurrentCoords = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/ride/current-coordinates-user`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.data && res.data.lat) setCurrentCoords({ lat: res.data.lat, lng: res.data.lng });
      } catch (err) {}
    };
    fetchCurrentCoords();
    const intervalId = setInterval(fetchCurrentCoords, 10000);
    return () => clearInterval(intervalId);
  }, []);

  if (isRideEnded) {
    return (
      <div className='h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center font-sans'>
        <div className='w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center text-white mb-8 animate-in zoom-in duration-500'>
          <i className="ri-checkbox-circle-fill text-5xl"></i>
        </div>
        <h1 className='text-3xl font-black text-white tracking-tight mb-2'>Trip Completed!</h1>
        <p className='text-slate-400 font-bold mb-10'>Hope you had a great ride with {ride?.captain.fullname.firstname}.</p>
        
        <div className='w-full bg-white/5 rounded-[40px] p-8 border border-white/10 mb-10'>
          <div className='flex items-center justify-between mb-6'>
            <span className='text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]'>Final Fare</span>
            <span className='text-3xl font-black text-emerald-400'>₹{ride?.fare}</span>
          </div>
          <div className='h-px bg-white/10 w-full mb-6' />
          <div className='flex items-center justify-between text-left'>
            <div>
              <p className='text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1'>Payment Status</p>
              <h4 className='text-sm font-bold text-white'>{isPaid ? 'Paid via Online' : 'Paid via Cash'}</h4>
            </div>
            <i className="ri-shield-check-fill text-emerald-500 text-3xl"></i>
          </div>
        </div>

        <button 
          onClick={() => navigate('/home')}
          className='w-full bg-white text-slate-900 font-black py-4 rounded-2xl shadow-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-[0.98]'
        >
          BACK TO HOME
        </button>
      </div>
    );
  }

  return (
    <div className='h-screen flex flex-col bg-slate-50 font-sans overflow-hidden'>
      <div className='h-[40%] w-full relative z-0 shrink-0'>
        {currentCoords && destinationCoords ? (
          <NavigationMap origin={currentCoords} destination={destinationCoords} />
        ) : (
          <LiveTracking />
        )}
        <div className='absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent' />
      </div>

      <div className='flex-1 p-6 flex flex-col min-h-0 overflow-y-auto scrollbar-hide'>
        <div className='bg-white rounded-[40px] shadow-xl shadow-black/5 p-8 mb-6 border border-slate-100'>
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-5'>
              <div className='w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center p-3 border border-slate-100'>
                <img className='w-full h-full object-contain' src={vehicleImg} alt={vType} />
              </div>
              <div>
                <h2 className='text-xl font-black text-slate-900 leading-tight capitalize'>
                  {ride?.captain.fullname.firstname} {ride?.captain.fullname.lastname}
                </h2>
                <p className='text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1'>
                  {ride?.captain.vehicle.plate} • {vType}
                </p>
              </div>
            </div>
            <div className='bg-emerald-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20'>
              <i className="ri-steering-2-fill text-xl"></i>
            </div>
          </div>

          <div className='space-y-6 pt-8 border-t border-slate-50'>
            <div className='flex items-center gap-5'>
              <div className='w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm'>
                <i className="ri-map-pin-2-fill text-2xl"></i>
              </div>
              <div className='flex-1 overflow-hidden'>
                <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Heading To</p>
                <h3 className='text-sm font-bold text-slate-900 mt-1 line-clamp-1'>{ride?.destination}</h3>
              </div>
            </div>

            <div className='flex items-center justify-between p-6 bg-slate-50 rounded-[32px]'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-900 shadow-sm'>
                  <i className="ri-wallet-3-fill text-xl"></i>
                </div>
                <div>
                  <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Fare Amount</p>
                  <h3 className='text-2xl font-black text-slate-900 tracking-tighter'>₹{ride?.fare}</h3>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>Payment</p>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${isPaid ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
                  {isPaid ? 'CONFIRMED' : 'PENDING'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-auto space-y-6 pb-6'>
          <div className='flex items-center justify-between px-4'>
            <span className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>Method</span>
            <div className='flex gap-2 bg-slate-100 p-1.5 rounded-[20px]'>
              <button 
                onClick={() => setPaymentMethod('online')}
                className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'online' ? 'bg-white text-slate-900 shadow-md shadow-black/5' : 'text-slate-500'}`}
              >
                Razorpay
              </button>
              <button 
                onClick={() => setPaymentMethod('cash')}
                className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'cash' ? 'bg-white text-slate-900 shadow-md shadow-black/5' : 'text-slate-500'}`}
              >
                Cash
              </button>
            </div>
          </div>

          {!isPaid ? (
            paymentMethod === 'online' ? (
              <button
                className='w-full bg-black text-white font-black py-5 rounded-[24px] shadow-2xl shadow-black/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase'
                onClick={handlePayment}
              >
                <span>PAY ₹{ride?.fare}</span>
                <i className="ri-arrow-right-line text-lg"></i>
              </button>
            ) : (
              <button
                className='w-full bg-slate-900 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase'
                onClick={handleCashPayment}
              >
                <span>CONFIRM CASH PAY</span>
                <i className="ri-hand-coin-line text-lg"></i>
              </button>
            )
          ) : (
            <div className='w-full bg-emerald-500 text-white font-black py-5 rounded-[24px] text-center text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20'>
              <i className="ri-checkbox-circle-line text-2xl"></i>
              <span>Payment Successful</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Riding

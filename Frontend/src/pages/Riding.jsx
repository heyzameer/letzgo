import React, { useState } from 'react'
import { Link,useLocation } from 'react-router-dom'
import { useEffect,useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';
import { useRef } from 'react';

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

  useEffect(() => {
    socket.on('ride-ended', (data) => {
      console.log("Ride finished:", data);
      navigate('/home');
    });
    // Cleanup
    return () => {
      socket.off('ride-ended');
    };
  }, [socket, navigate]);

  const handlePayment = async () => {
    await loadRazorpayScript();
    // 1. Create order on backend
    const amount = ride?.fare || 100; // fallback
    const orderRes = await fetch(`${import.meta.env.VITE_BASE_URL}/api/ride/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ amount })
    });

    const order = await orderRes.json();
    console.log("Order created:", order);
    if (!order.id) {
      alert("Failed to create order");
      return;
    }

    // 2. Open Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "LetzGo Ride Payment",
      description: "Complete your ride payment",
      order_id: order.id,
      handler: async function (response) {
        console.log("Payment success:", response);

        console.log("Verifying with:", {
  razorpay_order_id: response.razorpay_order_id,
  razorpay_payment_id: response.razorpay_payment_id,
  razorpay_signature: response.razorpay_signature,
  rideId: ride?._id
});

        // 3. Verify payment on backend
        const verifyRes = await fetch(`${import.meta.env.VITE_BASE_URL}/api/ride/verify-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            rideId: ride._id
          })
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.status === 200) {
          // Notify backend to end ride and redirect both user and captain
          socket.emit('payment-success', { rideId: ride._id });
          navigate('/home');
        } else {
          alert("Payment verification failed");
        }
      },
      prefill: {
        email: ride?.user?.email,
        name: ride?.user?.fullName?.firstName
      },
      theme: {
        color: "#3399cc"
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleCashPayment = () => {
    // You may want to call an endpoint to mark ride as paid by cash, or just end the ride
    socket.emit('payment-success', { rideId: ride._id });
    navigate('/home');
  };

  return (
    <div className='h-screen'>
      {/* <Link to={'/home'} className='fixed h-10 w-10 bg-white flex items-center justify-center rounded-full top-5 left-5 shadow-md'>
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link> */}
      <div className='h-1/2'>

      <LiveTracking/>
        {/* <img
          src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif'
          alt="Background"
          className='w-full h-full object-cover'
        /> */}
      </div>
      <div className='h-1/2 p-4'>
        <div className='flex items-center justify-between'>
          <img className='h-12' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
          <div className='text-right'>
            <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname + " "+ ride?.captain.fullname.lastname}</h2>
            <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
            <p className='text-sm text-gray-600'>{ride?.captain.vehicle.vehicleType}</p>
            {/* <h1 className='text-lg font-semibold'> otp </h1> */}
          </div>
        </div>

        <div className='flex gap-2 justify-between flex-col items-center'>
          <div className='w-full mt-5'>

            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>Destination</h3>
                <p className='text-sm -mt-1 text-gray-600'>{ride?.destination}</p>
              </div>
            </div>
            <div className='flex items-center gap-5 p-3'>
              <i className="ri-currency-line"></i>
              <div>
                <h3 className='text-lg font-medium'>Fare </h3>
                <p className='text-sm -mt-1 text-gray-600'>₹{ride?.fare}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Payment method selection */}
        <div className="mb-4">
          <label className="font-medium mr-4">Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="online">Online (Razorpay)</option>
            <option value="cash">Cash</option>
          </select>
        </div>
        {paymentMethod === 'online' ? (
          <button
            className='w-full bg-green-600 text-white font-semibold p-2 rounded-lg'
            onClick={handlePayment}
          >
            Make a Payment
          </button>
        ) : (
          <button
            className='w-full bg-yellow-600 text-white font-semibold p-2 rounded-lg'
            onClick={handleCashPayment}
          >
            Pay with Cash
          </button>
        )}
      </div>
    </div>
  )
}

export default Riding

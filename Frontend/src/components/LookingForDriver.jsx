import React from 'react'
import car from '../assets/car.jpg'
import auto from '../assets/auto.jpg'
import bike from '../assets/moto.jpg'


const LookingForDriver = (props) => {
    // Select image based on vehicleType
    let vehicleImg = car;
    if (props.vehicleType === 'auto') vehicleImg = auto;
    if (props.vehicleType === 'moto' || props.vehicleType === 'motorcycle' || props.vehicleType === 'bike') vehicleImg = bike;

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehicleFound(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Looking for a Driver</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <img className='h-20' src={vehicleImg} alt={props.vehicleType} />
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹Fare</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.fare[props.vehicleType]}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LookingForDriver
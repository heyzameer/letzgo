import React from 'react'

const VehiclePanel = (props) => {
    return (
        <div>
            <i className='ri-arrow-down-wide-line text-2xl absolute right-5 top-5' onClick={() => {
                props.setVehiclePanel(false)

            }}></i>
            <h3 className='text-2xl font-semibold mb-5'>Choose a vehicle</h3>

            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('car')
                props.setVehiclePanel(false)
            }} className=' active:border-2 border-gray-400 bg-gray-100 rounded-xl mb-2 flex w-full p-3 items-center justify-between'>
                <img className='h-12' src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1714472148/assets/95/a05538-918b-42d8-afe7-3c92325f2fd4/original/UberLux.png' />
                <div className='w-1/2 ml-1/2'>
                    <h4 className='font-medium text-base'>UberGo <span><i className='ri-user-3-fill'></i>4</span></h4>
                    <h5 className='font-medium text-sm'>2 mins away</h5>
                    <p className='font-medium text-xs text-gray-600'>Affordable compact ride</p>
                </div>
                <h2 className='text-xl font-semibold'>₹{props.fare.car}</h2>
            </div>

            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('moto')
                props.setVehiclePanel(false)
            }} className='active:border-2 bg-gray-100  border-gray-400 rounded-xl mb-2 flex w-full p-3 items-center justify-between'>
                <img className='h-12' src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png' />
                <div className='w-1/2 ml-1/2'>
                    <h4 className='font-medium text-base'>Moto <span><i className='ri-user-3-fill'></i>1</span></h4>
                    <h5 className='font-medium text-sm'>3 mins away</h5>
                    <p className='font-medium text-xs text-gray-600'>Affordable Motorcycle ride</p>
                </div>
                <h2 className='text-xl font-semibold'>₹{props.fare.moto}</h2>
            </div>

            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('auto')
                props.setVehiclePanel(false)
            }} className='active:border-2 bg-gray-100  border-gray-400 rounded-xl mb-2 flex w-full p-3 items-center justify-between'>
                <img className='h-12' src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png' />
                <div className='w-1/2 ml-1/2'>
                    <h4 className='font-medium text-base'>Auto <span><i className='ri-user-3-fill'></i>3</span></h4>
                    <h5 className='font-medium text-sm'>6 mins away</h5>
                    <p className='font-medium text-xs text-gray-600'>Affordable Auto ride</p>
                </div>
                <h2 className='text-xl font-semibold'>₹{props.fare.auto}</h2>
            </div>
        </div>
    )
}

export default VehiclePanel

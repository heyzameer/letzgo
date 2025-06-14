import React from 'react'
import car from '../assets/car.jpg'
import auto from '../assets/auto.jpg'
import bike from '../assets/moto.jpg'


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
                <img className='h-12' src={car} alt="Car" />
                <div className='w-1/2 ml-1/2'>
                    <h4 className='font-medium text-base'>Car <span><i className='ri-user-3-fill'></i>4</span></h4>
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
                <img className='h-12' src={bike} alt="Moto" />
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
                <img className='h-12' src={auto} alt="Auto" />
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

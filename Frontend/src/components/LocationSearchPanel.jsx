import React from 'react'

const LocationSearchPanel = ({ suggestions, setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField }) => {

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }
        // setVehiclePanel(true)
        // setPanelOpen(false)
    }

    const locations = [
        "Brototype ,hustlehub techpark, 4th floor,HSR Layout",
        "Brototype-1 ,hustlehub techpark, 4th floor,HSR Layout",
        "Brototype-2 ,hustlehub techpark, 4th floor,HSR Layout",
        "Brototype-3 ,hustlehub techpark, 4th floor,HSR Layout",
        "Brototype-4 ,hustlehub techpark, 4th floor,HSR Layout"
    ]

    return (
        <>
            {locations.map((location, index) => (
                <div key={index} onClick={() => {
                    setVehiclePanel(true)
                    setPanelOpen(false)
                }} className='flex items-center border-2 px-3 rounded-xl border-gray-300 active:border-black my-4 justify-start gap-4'>
                    <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'><i className="ri-map-pin-fill"></i></h2>
                    <h4 className='font-medium'>{location}</h4>
                </div>
            ))}

        </>
       
    )
}

export default LocationSearchPanel
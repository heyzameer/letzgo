import React, { useState, useEffect, useRef, useCallback } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: 28.6139, // Default to New Delhi
    lng: 77.2090
};

const GOOGLE_MAPS_LIBRARIES = ['places'];

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(defaultCenter);
    const [map, setMap] = useState(null);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: GOOGLE_MAPS_LIBRARIES
    });

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    const centerMap = useCallback(() => {
        if (map && currentPosition) {
            map.panTo(currentPosition);
            map.setZoom(15);
        }
    }, [map, currentPosition]);

    useEffect(() => {
        const updatePosition = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentPosition({
                        lat: latitude,
                        lng: longitude
                    });
                }, (error) => {
                    console.error("Geolocation error:", error);
                }, {
                    enableHighAccuracy: true
                });
            }
        };

        updatePosition();
        const intervalId = setInterval(updatePosition, 5000);
        return () => clearInterval(intervalId);
    }, []);

    // Effect to center map when it first loads or position changes significantly
    useEffect(() => {
        if (map && currentPosition) {
            // Only auto-center if the user hasn't panned away or for the first time
            // For now, let's just panTo whenever currentPosition is updated for the first few times
        }
    }, [map]);

    if (loadError) return <div className="h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold">Map Error</div>;
    if (!isLoaded) return <div className="h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold animate-pulse">Loading Map...</div>;

    return (
        <div className="relative w-full h-full">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentPosition}
                zoom={15}
                onLoad={map => setMap(map)}
                onUnmount={onUnmount}
                options={{
                    disableDefaultUI: true,
                    zoomControl: false,
                    styles: [
                        {
                            "featureType": "poi",
                            "elementType": "labels",
                            "stylers": [{ "visibility": "off" }]
                        }
                    ]
                }}
            >
                <Marker 
                    position={currentPosition} 
                    icon={{
                        url: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png', // Car icon
                        scaledSize: new window.google.maps.Size(40, 40),
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(20, 20)
                    }}
                />
            </GoogleMap>

            {/* Refresh / Re-center Button */}
            <button 
                onClick={centerMap}
                className="absolute bottom-28 lg:bottom-10 right-6 lg:right-10 w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-slate-900 hover:bg-slate-50 transition-all active:scale-[0.9] border border-slate-100 group z-30"
                title="Re-center Map"
            >
                <i className="ri-focus-3-line text-xl lg:text-2xl group-hover:rotate-45 transition-transform"></i>
            </button>
        </div>
    )
}

export default LiveTracking
import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_LIBRARIES = ['places'];

const containerStyle = {
  width: '100%',
  height: '100%',
};

const NavigationMap = ({ origin, destination }) => {
  const [directions, setDirections] = React.useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [centered, setCentered] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // Do NOT auto-center the map on origin/destination changes
  // Only center when user clicks the button

  useEffect(() => {
    if (
      isLoaded &&
      origin &&
      destination &&
      typeof origin.lat === 'number' &&
      typeof origin.lng === 'number' &&
      typeof destination.lat === 'number' &&
      typeof destination.lng === 'number'
    ) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            setDirections(null);
          }
        }
      );
    } else {
      setDirections(null);
    }
  }, [isLoaded, origin, destination]);

  // Center map only when user clicks the button
  const handleCenter = () => {
    if (mapRef && origin) {
      mapRef.panTo(origin);
      setCentered(true);
    }
  };

  if (loadError) return <div>Map cannot be loaded right now.</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={origin} // Initial center, but will not auto-pan after mount
        zoom={13}
        onLoad={map => setMapRef(map)}
        options={{
          clickableIcons: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {directions ? (
          <DirectionsRenderer directions={directions} />
        ) : (
          <>
            {origin && <Marker position={origin} />}
            {destination && <Marker position={destination} />}
          </>
        )}
      </GoogleMap>
      {/* Center button */}
      <button
        style={{
          position: 'absolute',
          top: 620,
          right: 12,
          zIndex: 10,
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: 6,
          padding: '8px 12px',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
        onClick={handleCenter}
      >
        Center
      </button>
    </div>
  );
};

export default NavigationMap;

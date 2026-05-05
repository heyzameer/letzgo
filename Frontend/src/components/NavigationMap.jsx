import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_LIBRARIES = ['places'];

const containerStyle = {
  width: '100%',
  height: '100%',
};

const NavigationMap = ({ origin, destination }) => {
  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const fetchDirections = useCallback(() => {
    if (
      isLoaded &&
      origin?.lat &&
      destination?.lat
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
          }
        }
      );
    }
  }, [isLoaded, origin, destination]);

  useEffect(() => {
    fetchDirections();
  }, [fetchDirections]);

  const onCenter = () => {
    if (map && origin) {
      map.panTo(origin);
      map.setZoom(16);
    }
  };

  if (loadError) return <div className="h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold">Map Error</div>;
  if (!isLoaded) return <div className="h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold animate-pulse">Loading Navigation...</div>;

  return (
    <div className="relative w-full h-full font-sans">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={origin}
        zoom={14}
        onLoad={map => setMap(map)}
        options={{
          disableDefaultUI: true,
          clickableIcons: false,
          styles: [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#7c93a3" }, { "lightness": "-10" }]
            },
            {
                "featureType": "administrative.country",
                "elementType": "geometry",
                "stylers": [{ "visibility": "on" }]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{ "visibility": "simplified" }]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{ "color": "#d2e4f3" }, { "visibility": "on" }]
            }
          ]
        }}
      >
        {directions && (
          <DirectionsRenderer 
            directions={directions} 
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#10b981', // Emerald-500
                strokeWeight: 6,
                strokeOpacity: 0.8
              }
            }} 
          />
        )}

        {/* Origin / Captain Marker */}
        <Marker 
          position={origin} 
          icon={{
            url: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png', // Car icon
            scaledSize: new window.google.maps.Size(40, 40),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(20, 20)
          }}
        />

        {/* Destination Marker */}
        <Marker 
          position={destination} 
          icon={{
            url: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png', // Red pin icon
            scaledSize: new window.google.maps.Size(40, 40),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(20, 40)
          }}
        />
      </GoogleMap>

      {/* Re-center Button */}
      <button 
        onClick={onCenter}
        className="absolute bottom-32 lg:bottom-10 right-6 lg:right-10 w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-slate-900 hover:bg-slate-50 transition-all active:scale-[0.9] border border-slate-100 group z-30"
        title="Focus on Location"
      >
        <i className="ri-focus-3-line text-xl lg:text-2xl group-hover:rotate-45 transition-transform"></i>
      </button>

      {/* Floating Info Panel */}
      {directions && directions.routes[0]?.legs[0] && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] lg:w-[400px] bg-slate-900/90 backdrop-blur-md rounded-[28px] p-6 border border-white/10 shadow-2xl z-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                    <i className="ri-navigation-fill text-2xl"></i>
                </div>
                <div>
                    <h4 className="text-white font-black tracking-tight text-lg leading-none">
                        {directions.routes[0].legs[0].duration.text}
                    </h4>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1.5">
                        Est. Time to Destination
                    </p>
                </div>
            </div>
            <div className="text-right">
                <h4 className="text-emerald-400 font-black tracking-tight text-lg leading-none">
                    {directions.routes[0].legs[0].distance.text}
                </h4>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1.5">
                    Remaining
                </p>
            </div>
        </div>
      )}
    </div>
  );
};

export default NavigationMap;

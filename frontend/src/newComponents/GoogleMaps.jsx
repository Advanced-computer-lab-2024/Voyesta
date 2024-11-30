import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GoogleMaps = ({ setAddress }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
    setMap(map);

    map.addListener('click', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      if (marker) {
        marker.setMap(null);
      }

      const newMarker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
      });
      setMarker(newMarker);

      getAddressDetails(lat, lng);
    });
  };

  const getAddressDetails = async (lat, lng) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          latlng: `${lat},${lng}`,
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        },
      });

      if (response.data.status !== 'OK') {
        throw new Error('Failed to fetch address details');
      }

      const result = response.data.results[0];
      const formattedAddress = result.formatted_address;
      setAddress(formattedAddress);
    } catch (error) {
      console.error('Error fetching address details:', error);
    }
  };

  useEffect(() => {
    if (!map) {
      initMap();
    }
  }, [map]);

  return <div id="map" style={{ height: '400px', width: '100%' }}></div>;
};

export default GoogleMaps;
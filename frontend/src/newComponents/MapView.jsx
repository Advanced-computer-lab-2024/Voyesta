import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import default marker images
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const MapView = ({lat, lng}) => {
  const [markerPosition, setMarkerPosition] = useState([51.505, -0.09]);

  useEffect(() => {
    // Initialize the map
    const map = L.map('map', {
      center: [lat, lng], // Starting position (latitude, longitude)
      zoom: 15, // Starting zoom level
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 25,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Set default icon options
    const DefaultIcon = L.icon({
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      iconSize: [25, 41], // size of the icon
      iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
      popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
      shadowSize: [41, 41], // size of the shadow
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    // Add a marker with the default icon
    const marker = L.marker(markerPosition).addTo(map);

    // Update marker position on map click
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      marker.setLatLng([lat, lng]);
    });

    // Clean up the map on component unmount
    return () => {
      map.remove();
    };
  }, [markerPosition]);

  return <div id="map" style={{ height: '100vh', width: '100%' }} />;
};

export default MapView;
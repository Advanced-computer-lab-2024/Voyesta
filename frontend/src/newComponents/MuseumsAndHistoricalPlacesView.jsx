import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MuseumsAndHistoricalPlacesList from './MuseumsAndHistoricalPlacesList';
import CreateMuseumAndHistoricalPlace from './CreateMuseumAndHistoricalPlace';

const MuseumsAndHistoricalPlacesView = ({ baseUrl, role }) => {
  const [places, setPlaces] = useState([]);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('viewPlaces');

  useEffect(() => {
    fetchPlaces();
  }, [activeTab]);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getPlaces`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
      setMessage("Error fetching places.");
    }
  };

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Museums and Historical Places</h1>

      {message && <div className="text-red-500 mb-4">{message}</div>}

      {role === 'tourismGovernor' && (
        <>
          {/* Sub-navbar for tourismGovernor */}
          <div className="flex justify-around border-b mb-4">
            <button
              className={`p-2 ${activeTab === 'viewPlaces' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('viewPlaces')}
            >
              View Places
            </button>
            <button
              className={`p-2 ${activeTab === 'createPlace' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('createPlace')}
            >
              Create Place
            </button>
          </div>

          {/* Content based on Active Tab */}
          {activeTab === 'viewPlaces' ? (
            <MuseumsAndHistoricalPlacesList fetchPlaces={fetchPlaces} baseUrl={baseUrl} places={places} role={role} />
          ) : activeTab === 'createPlace' && (
            <CreateMuseumAndHistoricalPlace getAuthHeaders={getAuthHeaders} />
          )}
        </>
      )}

      {role !== 'tourismGovernor' && (
        <MuseumsAndHistoricalPlacesList fetchPlaces={fetchPlaces} baseUrl={baseUrl} places={places} role={role} />
      )}
    </div>
  );
};

export default MuseumsAndHistoricalPlacesView;
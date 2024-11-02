import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MuseumsAndHistoricalPlacesList from './MuseumsAndHistoricalPlacesList';
import CreateMuseumAndHistoricalPlace from './CreateMuseumAndHistoricalPlace';
import PreferencesFilter from './PreferencesFilter'; // Import the preferences component

const MuseumsAndHistoricalPlacesView = ({ baseUrl, role }) => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('viewPlaces');
  const [selectedPreference, setSelectedPreference] = useState('');
  
  useEffect(() => {
    fetchPlaces();
  }, [activeTab]);

  useEffect(() => {
    applyFilters();
  }, [places, selectedPreference]); // Add selectedTags to dependencies

  const fetchPlaces = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getPlaces`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPlaces(response.data);
      setFilteredPlaces(response.data); // Initialize filtered places
    } catch (error) {
      console.error('Error fetching places:', error);
      setMessage("Error fetching places.");
    }
  };

  const applyFilters = () => {
    let filtered = [...places];

    // Filter by selected tags
    if (selectedPreference.length > 0) {
      filtered = filtered.filter(place =>
        selectedPreference.every(tag => place.tags.includes(tag))
      );
    }

    // Set filtered places to state
    setFilteredPlaces(filtered);
  };

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
  };

  return (
    <div className="flex">

      {/* Filtering Components */}
      <div className="w-1/5 p-4 bg-red-300">
        <h2 className="text-lg font-bold mb-4 bg-green-200 p-2">Filter by Tags</h2>
        <PreferencesFilter setSelectedPreferences={setSelectedPreference} />
      </div>

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
            {activeTab === 'viewPlaces' && (
              <MuseumsAndHistoricalPlacesList
                fetchPlaces={fetchPlaces}
                baseUrl={baseUrl}
                places={filteredPlaces} // Use filtered places
                role={role}
              />
            )}

            {activeTab === 'createPlace' && (
              <CreateMuseumAndHistoricalPlace getAuthHeaders={getAuthHeaders} />
            )}
          </>
        )}

        {role !== 'tourismGovernor' && (
          <MuseumsAndHistoricalPlacesList
            fetchPlaces={fetchPlaces}
            baseUrl={baseUrl}
            places={filteredPlaces} // Use filtered places
            role={role}
          />
        )}
      </div>

    </div>
  );
};

export default MuseumsAndHistoricalPlacesView;

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
  const [selectedTags, setSelectedTags] = useState(''); // Initialize as a string

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
      setFilteredPlaces(response.data); // Initialize filtered places
    } catch (error) {
      console.error('Error fetching places:', error);
      setMessage("Error fetching places.");
    }
  };

  const applyTagFilter = () => {
    console.log("applyTagFilter called"); // Debug log
    let filtered = [...places];
    
    console.log(Array.isArray(selectedTags));
    console.log("selectedTags:", selectedTags); // Debug log
    
    // Convert selectedTags to an array if it's a string
    const tagsArray = selectedTags.split(',').map(tag => tag.trim());

    // Check if "--All--" is selected or if selectedTags is empty
    if (tagsArray.includes("--All--") || selectedTags.trim() === '') {
      setFilteredPlaces(places);
      return;
    }

    // Ensure tagsArray is an array
    if (tagsArray.length > 0) {
      filtered = filtered.filter(place =>
        tagsArray.every((tag) => {
          return place.tags.includes(tag);
        })
      );
      console.log(tagsArray);
    }
  
    setFilteredPlaces(filtered);
  };

  return (
    <div className="flex">

      {role === 'tourist' && (
        <>
            {/* Tag Filtering Section */}
        <div className="w-1/5 p-4 bg-red-300">
          <h2 className="text-lg font-bold mb-4 bg-green-200 p-2">Filter by Tags</h2>
          <PreferencesFilter setSelectedPreferences={setSelectedTags} />
          <button
            onClick={applyTagFilter}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
        </>
      )}

      <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
        <h1 className="text-2xl text-gray-600 font-bold mb-3">Museums and Historical Places</h1>

        {message && <div className="text-red-500 mb-4">{message}</div>}

        {role === 'tourismGovernor' && (
          <>
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

            {activeTab === 'viewPlaces' ? (
              <MuseumsAndHistoricalPlacesList
                fetchPlaces={fetchPlaces}
                baseUrl={baseUrl}
                places={filteredPlaces}
                role={role}
              />
            ) : (
              <CreateMuseumAndHistoricalPlace getAuthHeaders={() => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })} />
            )}
          </>
        )}

        {role !== 'tourismGovernor' && (
          <MuseumsAndHistoricalPlacesList
            fetchPlaces={fetchPlaces}
            baseUrl={baseUrl}
            places={filteredPlaces}
            role={role}
          />
        )}
      </div>

    </div>
  );
};

export default MuseumsAndHistoricalPlacesView;
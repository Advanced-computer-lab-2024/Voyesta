import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MuseumsAndHistoricalPlacesList from './MuseumsAndHistoricalPlacesList';
import CreateMuseumAndHistoricalPlace from './CreateMuseumAndHistoricalPlace';
import PreferencesFilter from './PreferencesFilter'; // Import the preferences component
import CurrencyConverter from './CurrencyConverter';
import { Snackbar } from '@mui/material';


const MuseumsAndHistoricalPlacesView = ({ baseUrl, role }) => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('viewPlaces');
  const [selectedTags, setSelectedTags] = useState(''); // Initialize as a string
  const [prices, setPrices] = useState([]);
  const [convertedPrices, setConvertedPrices] = useState([]);
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
      setPrices(response.data.map(place => ({
        foreigner: place.ticketPrices.foreigner,
        native: place.ticketPrices.native,
        student: place.ticketPrices.student
      })));
    } catch (error) {
      console.error('Error fetching places:', error);
      setMessage("Error fetching places.");
    }
  };

  const resetFilters = () => {
    setSelectedTags('');
    setTargetCurrency('USD');
    fetchPlaces();
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
    <div className="bg-gray-100 min-h-screen">
      {role === 'tourist' && (
        <div className="bg-gray-200 shadow-md p-4">
          <div className="flex flex-wrap justify-center items-center space-x-4">
            <div className="relative">
              <button
                id="dropdownSortButton"
                className="inline-flex items-center px-3 py-2 mb-3 me-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg md:mb-0 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
                onClick={applyTagFilter}
              >
                Apply Filters
              </button>
            </div>
            <PreferencesFilter setSelectedPreferences={setSelectedTags} />
            <button
              onClick={resetFilters}
              className="p-2 bg-red-500 text-white rounded"
            >
              Reset Filters
            </button>
            <CurrencyConverter 
              prices={prices} 
              setConvertedPrices={setConvertedPrices} 
              setTargetCurrency={setTargetCurrency} 
            />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex">

          <div className={`${role === 'tourist' ? 'w-3/4' : 'w-full'}`}>
            <div className="relative text-center bg-white shadow-md rounded p-6">
              <h1 className="text-2xl text-gray-600 font-bold mb-4">Available Museums and Historical Places</h1>
              {message && <div className="text-red-500 mb-4">{message}</div>}

              {(role === 'tourismGovernor') && (
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
                      convertedPrices={convertedPrices}
                      targetCurrency={targetCurrency}
                      setSuccessMessage={setSuccessMessage}
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
                  convertedPrices={convertedPrices}
                  targetCurrency={targetCurrency}
                  setSuccessMessage={setSuccessMessage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Snackbar open={!!successMessage} message={successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')} />
    </div>
  );
};

export default MuseumsAndHistoricalPlacesView;
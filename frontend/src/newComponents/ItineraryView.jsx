import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItinerariesList from './ItinerariesList';
import CreateItinerary from './CreateItinerary';
import PriceFilterBar from './PriceFilterBar';
import DateRangeFilter from './DateRangeFilter';
import PreferencesFilter from './PreferencesFilter'; // Import the new filter component

const ItineraryView = ({ baseUrl, role }) => {
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('viewItineraries');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPreference, setSelectedPreference] = useState(''); // State for selected preference

  useEffect(() => {
    fetchItineraries();
  }, [activeTab]);

  useEffect(() => {
    applyFilters();
  }, [itineraries, startDate, endDate, selectedPreference]); // Add selectedPreference to dependencies

  const fetchItineraries = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getItinerary`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setItineraries(response.data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      setMessage("Error fetching itineraries.");
    }
  };

  const applyFilters = () => {
    let filtered = [...itineraries];

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(itinerary => new Date(itinerary.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(itinerary => new Date(itinerary.date) <= new Date(endDate));
    }

    // Filter by selected preference
    if (selectedPreference) {
      filtered = filtered.filter(itinerary => itinerary.preferences.includes(selectedPreference));
    }

    // Set filtered itineraries to state
    setFilteredItineraries(filtered);
  };

  const sortByRating = () => {
    const sorted = [...filteredItineraries].sort((a, b) => b.rating - a.rating);
    setFilteredItineraries(sorted);
  };

  const sortByPrice = () => {
    const sorted = [...filteredItineraries].sort((a, b) => a.price - b.price);
    setFilteredItineraries(sorted);
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
            <h2 className="text-lg font-bold mb-4 bg-green-200 p-2">Filter and Sort</h2>
              <PriceFilterBar products={itineraries} setProducts={setFilteredItineraries} />
              <DateRangeFilter setStartDate={setStartDate} setEndDate={setEndDate} />
              <PreferencesFilter setSelectedPreferences={setSelectedPreference} /> {/* Include preferences filter */}
              <button onClick={sortByRating}>Sort by Rating</button>
              <button onClick={sortByPrice}>Sort by Price</button>
          </div>
          
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Available Itineraries</h1>

      {message && <div className="text-red-500 mb-4">{message}</div>}

      {role === 'tourGuide' && (
        <>
          {/* Sub-navbar for tourGuide */}
          <div className="flex justify-around border-b mb-4">
            <button
              className={`p-2 ${activeTab === 'viewItineraries' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('viewItineraries')}
            >
              View Itineraries
            </button>
            <button
              className={`p-2 ${activeTab === 'createItinerary' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('createItinerary')}
            >
              Create Itinerary
            </button>
          </div>

          {/* Filtering Components */}
          {activeTab === 'viewItineraries' && (
            <>
            <div className="w-1/5 p-4 bg-red-300">
            <h2 className="text-lg font-bold mb-4 bg-green-200 p-2">Filter and Sort</h2>
              <PriceFilterBar products={itineraries} setProducts={setFilteredItineraries} />
              <DateRangeFilter setStartDate={setStartDate} setEndDate={setEndDate} />
              <PreferencesFilter setSelectedPreferences={setSelectedPreference} /> {/* Include preferences filter */}
              <button onClick={sortByRating}>Sort by Rating</button>
              <button onClick={sortByPrice}>Sort by Price</button>
              <ItinerariesList fetchItineraries={fetchItineraries} baseUrl={baseUrl} itineraries={filteredItineraries} role={role} />
            </div>
            </>
          )}

          {activeTab === 'createItinerary' && (
            <CreateItinerary getAuthHeaders={getAuthHeaders} />
          )}
        </>
      )}

      {role !== 'tourGuide' && (
        <>
          <ItinerariesList fetchItineraries={fetchItineraries} baseUrl={baseUrl} itineraries={filteredItineraries} role={role} />
        </>
      )}
    </div>
  
    </div>
    );
};

export default ItineraryView;

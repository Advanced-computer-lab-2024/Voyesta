import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItinerariesList from './ItinerariesList';
import CreateItinerary from './CreateItinerary';
import PriceFilterBar from './PriceFilterBar';
import DateRangeFilter from './DateRangeFilter';
import PreferencesFilter from './PreferencesFilter';
import CurrencyConverter from './CurrencyConverter';

const ItineraryView = ({ baseUrl, role }) => {
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('viewItineraries');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPreference, setSelectedPreference] = useState('');
  const [sortOption, setSortOption] = useState(''); // State for selected sort option
  const [prices, setPrices] = useState([]);
  const [convertedPrices, setConvertedPrices] = useState([]);
  const [targetCurrency, setTargetCurrency] = useState('USD');

  useEffect(() => {
    fetchItineraries();
  }, [activeTab]);

  const fetchItineraries = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getItinerary`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setItineraries(response.data);
      setFilteredItineraries(response.data); // Initialize filtered itineraries
      setPrices(response.data.map(itinerary => itinerary.tourPrice));
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
      filtered = filtered.filter(itinerary => itinerary.preferences && itinerary.preferences.includes(selectedPreference));
    }

    // Sort after filtering
    sortItineraries(filtered);
  };

  const sortItineraries = (itinerariesToSort) => {
    const sorted = [...itinerariesToSort].sort((a, b) => {
      if (sortOption === 'priceAsc') return a.tourPrice - b.tourPrice;
      if (sortOption === 'priceDesc') return b.tourPrice - a.tourPrice;
      if (sortOption === 'ratingAsc') return a.rating - b.rating;
      if (sortOption === 'ratingDesc') return b.rating - a.rating;
      return 0; // Default case, no sorting
    });
    setFilteredItineraries(sorted);
  };

  return (
    <div className="flex">
      {role === 'tourist' && (
        <div className="w-1/5 p-4 bg-red-300">
          <h2 className="text-lg font-bold mb-4 bg-green-200 p-2">Filter and Sort</h2>
          <PriceFilterBar items={itineraries} setItems={setFilteredItineraries} convertedPrices={convertedPrices} priceProperty="tourPrice" />
          <DateRangeFilter setStartDate={setStartDate} setEndDate={setEndDate} />
          <PreferencesFilter setSelectedPreferences={setSelectedPreference} />
          
          {/* Sorting Dropdown */}
          <div className="mb-4">
            <label className="block mb-2">Sort by</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-2 border"
            >
              <option value="">Sort</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="ratingAsc">Rating: Low to High</option>
              <option value="ratingDesc">Rating: High to Low</option>
            </select>
          </div>

          <button
            onClick={applyFilters}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Apply Filters
          </button>

          <div className="mb-4">
            <CurrencyConverter prices={prices} setConvertedPrices={setConvertedPrices} setTargetCurrency={setTargetCurrency} />
          </div>
        </div>
      )}

      <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
        <h1 className="text-2xl text-gray-600 font-bold mb-3">Available Itineraries</h1>

        {message && <div className="text-red-500 mb-4">{message}</div>}

        {role === 'tourGuide' && (
          <>
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

            {activeTab === 'viewItineraries' ? (
              <ItinerariesList fetchItineraries={fetchItineraries} baseUrl={baseUrl} itineraries={filteredItineraries} role={role} convertedPrices={convertedPrices} targetCurrency={targetCurrency} />
            ) : (
              <CreateItinerary />
            )}
          </>
        )}

        {role !== 'tourGuide' && (
          <ItinerariesList fetchItineraries={fetchItineraries} baseUrl={baseUrl} itineraries={filteredItineraries} role={role} convertedPrices={convertedPrices} targetCurrency={targetCurrency} />
        )}
      </div>
    </div>
  );
};

export default ItineraryView;
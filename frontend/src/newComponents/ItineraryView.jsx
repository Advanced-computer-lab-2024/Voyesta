import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItinerariesList from './ItinerariesList';
import CreateItinerary from './CreateItinerary';
import PriceFilterBar from './PriceFilterBar';
import DateRangeFilter from './DateRangeFilter';
import PreferencesFilter from './PreferencesFilter';
import CurrencyConverter from './CurrencyConverter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate , useLocation } from 'react-router-dom';
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
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isPreferenceDropdownOpen, setIsPreferenceDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  useEffect(() => {
    const returnToGuide = location.state?.returnToGuide;
    if (returnToGuide) {
      // Add return button or auto-return after booking
      return () => navigate('/guest/guide');
    }
  }, []);

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
      console.log('Itineraries:', response.data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      setMessage("Error fetching itineraries.");
    }
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedPreference('All');
    setSortOption('');
    fetchItineraries();
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
      filtered = filtered.filter(itinerary => 
        itinerary.tags && itinerary.tags.some(tag => tag.Name === selectedPreference)
      );
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

  const handleSortOptionChange = (option) => {
        setSortOption(option);
      
      // Sort the entire original list of itineraries with the new option
      const sorted = [...itineraries].sort((a, b) => {
        if (option === 'priceAsc') return a.tourPrice - b.tourPrice;
        if (option === 'priceDesc') return b.tourPrice - a.tourPrice;
        if (option === 'ratingAsc') return a.rating - b.rating;
        if (option === 'ratingDesc') return b.rating - a.rating;
        return 0; // Default case, no sorting
      });

      setFilteredItineraries(sorted);
      setIsSortDropdownOpen(false);
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
  };

  const togglePreferenceDropdown = () => {
    setIsPreferenceDropdownOpen(!isPreferenceDropdownOpen);
  };
  
  return (
    <div className="bg-gray-100 min-h-screen">
      {role === 'tourist' && (
        <div className="bg-gray-200 shadow-md p-4">
          <div className="flex flex-wrap justify-center items-center space-x-4">
            
            <div className='flex flex-row justify-center space-x-4'>
              <div className="relative">
                <button
                  id="dropdownSortButton"
                  className="inline-flex items-center px-3 py-2 mb-3 me-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg md:mb-0 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                  onClick={toggleSortDropdown}
                >
                  {sortOption || 'Sort by'}
                  <svg className="w-2 h-2 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                  </svg>
                </button>

                {isSortDropdownOpen && (
                  <div id="dropdownSort" className="absolute z-50 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSortButton">
                      <li>
                        <button 
                          onClick={() =>  handleSortOptionChange('priceAsc')} 
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Price: Low to High
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => handleSortOptionChange('priceDesc')} 
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Price: High to Low
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => handleSortOptionChange('ratingAsc')} 
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Rating: Low to High
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => handleSortOptionChange('ratingDesc')} 
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Rating: High to Low
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <PreferencesFilter setSelectedPreferences={setSelectedPreference} />
              <DateRangeFilter setStartDate={setStartDate} setEndDate={setEndDate} />
              <button
                onClick={applyFilters}
                className="p-2 bg-blue-900 text-white rounded"
              >
                Apply Filters
              </button>
              <button onClick={resetFilters} className="p-2 bg-red-500 text-white rounded">
                Reset Filters
              </button>
            </div>

            
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex">
          {role === 'tourist' && (
            <div className="w-1/4 pr-4">
              <div className="bg-gray-200 p-4">
                {/* <h2 className="text-2xl font-bold mb-4 p-2 text-center">Filter and Sort</h2> */}
                <PriceFilterBar 
                  items={itineraries} 
                  setItems={setFilteredItineraries} 
                  convertedPrices={convertedPrices} 
                  priceProperty="tourPrice" 
                />
                <div className="mb-4">
                  <CurrencyConverter 
                    prices={prices} 
                    setConvertedPrices={setConvertedPrices} 
                    setTargetCurrency={setTargetCurrency} 
                  />
                </div>
              </div>
            </div>
          )}

          <div className={`${role === 'tourist' ? 'w-3/4' : 'w-4/5'} m-auto`}>
            <div className="relative text-center bg-white shadow-md rounded p-6">
              <h1 className="text-2xl text-gray-600 font-bold mb-4">Available Itineraries</h1>
              
              {message && <div className="text-red-500 mb-4">{message}</div>}

              {(role === 'tourGuide' || role === 'admin') && (
                <>{ role === 'tourGuide' &&
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
                  </div>}

                  {activeTab === 'viewItineraries' ? (
                    <ItinerariesList
                      fetchItineraries={fetchItineraries}
                      baseUrl={baseUrl}
                      itineraries={filteredItineraries}
                      role={role}
                      convertedPrices={convertedPrices}
                      targetCurrency={targetCurrency}
                    />
                  ) : (
                    <CreateItinerary />
                  )}
                </>
              )}

              {role !== 'tourGuide' && (
                <ItinerariesList
                  fetchItineraries={fetchItineraries}
                  baseUrl={baseUrl}
                  itineraries={filteredItineraries}
                  role={role}
                  convertedPrices={convertedPrices}
                  targetCurrency={targetCurrency}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;
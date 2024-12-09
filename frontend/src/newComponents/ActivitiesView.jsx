import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActivitiesList from './ActivitiesList';
import CreateActivity from './CreateActivity';
import PriceFilterBar from './PriceFilterBar';
import CategoryFilter from './CategoryFilter';
import RatingFilter from './RatingFilter';
import DateRangeFilter from './DateRangeFilter';
import CurrencyConverter from './CurrencyConverter';
import { useNavigate } from 'react-router-dom';
const ActivitiesView = ({ baseUrl, role }) => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('viewActivity');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOption, setSortOption] = useState('Sort by');
  const [prices, setPrices] = useState([]);
  const [convertedPrices, setConvertedPrices] = useState([]);
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const returnToGuide = location.state?.returnToGuide;
    if (returnToGuide) {
      // Add return button or auto-return after booking
      return () => navigate('/guest/guide');
    }
  }, []);


  useEffect(() => {
    fetchActivities();
  }, [activeTab]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getActivity`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response.data);
      setActivities(response.data);
      setFilteredActivities(response.data);
      setPrices(response.data.map((activity) => activity.price));
    } catch (error) {
      console.error('Error fetching activities:', error);
      setMessage('Error fetching activities.');
    }
  };

  const applyFilters = () => {
    let filtered = [...activities];

    if (category) {
      filtered = filtered.filter((activity) => activity.category._id === category);
    }
    if (rating) {
      filtered = filtered.filter((activity) => {
        const avgRating =
          activity.ratings.length > 0
            ? activity.ratings.reduce((acc, curr) => acc + curr.rating, 0) / activity.ratings.length
            : 0;
        return avgRating === parseFloat(rating);
      });
    }
    if (startDate) {
      filtered = filtered.filter((activity) => new Date(activity.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter((activity) => new Date(activity.date) <= new Date(endDate));
    }

    setFilteredActivities(filtered);
    sortActivities(sortOption, filtered);
  };

  const resetFilters = () => {
    setCategory('');
    setRating('');
    setStartDate('');
    setEndDate('');
    setSortOption('Sort by');
    setFilteredActivities(activities);
  };

  const sortActivities = (option, activitiesToSort) => {
    const sorted = [...activitiesToSort].sort((a, b) => {
      const avgRatingA =
        a.ratings.length > 0
          ? a.ratings.reduce((acc, curr) => acc + curr.rating, 0) / a.ratings.length
          : 0;
      const avgRatingB =
        b.ratings.length > 0
          ? b.ratings.reduce((acc, curr) => acc + curr.rating, 0) / b.ratings.length
          : 0;

      if (option === 'priceAsc') return a.price - b.price;
      if (option === 'priceDesc') return b.price - a.price;
      if (option === 'ratingAsc') return avgRatingA - avgRatingB;
      if (option === 'ratingDesc') return avgRatingB - avgRatingA;
      return 0;
    });
    setFilteredActivities(sorted);
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {(role === 'tourist' || role === 'guest') && (
        <div className="bg-gray-200 shadow-md p-4">
          <div className="flex flex-wrap justify-center items-center space-x-4">
            <div className="relative">
              <button
                id="dropdownSortButton"
                className="inline-flex items-center px-3 py-2 mb-3 me-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg md:mb-0 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
                onClick={toggleSortDropdown}
              >
                {sortOption}
                <svg className="w-2 h-2 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>

              {isSortDropdownOpen && (
                <div id="dropdownSort" className="absolute z-50 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSortButton">
                    <li>
                      <button 
                        onClick={() => { 
                          setSortOption('Price: Low to High'); 
                          sortActivities('priceAsc', filteredActivities);
                          setIsSortDropdownOpen(false); 
                        }} 
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Price: Low to High
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => { 
                          setSortOption('Price: High to Low'); 
                          sortActivities('priceDesc', filteredActivities);
                          setIsSortDropdownOpen(false); 
                        }} 
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Price: High to Low
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => { 
                          setSortOption('Rating: Low to High'); 
                          sortActivities('ratingAsc', filteredActivities);
                          setIsSortDropdownOpen(false); 
                        }} 
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Rating: Low to High
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => { 
                          setSortOption('Rating: High to Low'); 
                          sortActivities('ratingDesc', filteredActivities);
                          setIsSortDropdownOpen(false); 
                        }} 
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Rating: High to Low
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <CategoryFilter setSelectedCategory={setCategory} baseUrl={baseUrl} />
            <RatingFilter setSelectedRating={setRating} />
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
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex">
          {role === 'tourist' && (
            <div className="w-1/4 pr-4">
              <div className="bg-gray-200 p-4">
                <PriceFilterBar 
                  items={activities} 
                  setItems={setFilteredActivities} 
                  convertedPrices={convertedPrices} 
                  priceProperty="price" 
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


          <div className={`${role === 'tourist' ? 'w-3/4' : 'w-full'}`}>
            <div className="relative text-center bg-white shadow-md rounded p-6">
              <h1 className="text-2xl text-gray-600 font-bold mb-4">Available Activities</h1>
              {message && <div className="text-red-500 mb-4">{message}</div>}

              {(role === 'advertiser') && (
                <>{ role === 'advertiser' &&
                  <div className="flex justify-around border-b mb-4">
                    <button
                      className={`p-2 ${activeTab === 'viewActivity' ? 'border-b-2 border-blue-500' : ''}`}
                      onClick={() => setActiveTab('viewActivity')}
                    >
                      View Activity
                    </button>
                    <button
                      className={`p-2 ${activeTab === 'createActivity' ? 'border-b-2 border-blue-500' : ''}`}
                      onClick={() => setActiveTab('createActivity')}
                    >
                      Create Activity
                    </button>
                  </div>}

                  {activeTab === 'viewActivity' ? (
                    <ActivitiesList
                      fetchActivities={fetchActivities}
                      baseUrl={baseUrl}
                      activities={filteredActivities}
                      role={role}
                      convertedPrices={convertedPrices}
                      targetCurrency={targetCurrency}
                    />
                  ) : (
                    <CreateActivity />
                  )}
                </>
              )}
              {(role !== 'advertiser')&& (
                <ActivitiesList
                  fetchActivities={fetchActivities}
                  baseUrl={baseUrl}
                  activities={filteredActivities}
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

export default ActivitiesView;
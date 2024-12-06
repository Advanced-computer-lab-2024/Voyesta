import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActivitiesList from './ActivitiesList';
import CreateActivity from './CreateActivity';
import PriceFilterBar from './PriceFilterBar';
import CategoryFilter from './CategoryFilter';
import RatingFilter from './RatingFilter';
import DateRangeFilter from './DateRangeFilter';
import CurrencyConverter from './CurrencyConverter';

const ActivitiesView = ({ baseUrl, role }) => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('viewActivity');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOption, setSortOption] = useState(''); // Added sort option state
  const [prices, setPrices] = useState([]);
  const [convertedPrices, setConvertedPrices] = useState([]);
  const [targetCurrency, setTargetCurrency] = useState('USD');

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
    sortActivities(sortOption, filtered); // Sort after filtering
  };

  const resetFilters = () => {
    setCategory('');
    setRating('');
    setStartDate('');
    setEndDate('');
    setSortOption('');
    fetchActivities();
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
      return 0; // Default case, no sorting
    });
    setFilteredActivities(sorted);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {role === 'tourist' && (
        <div className="w-1/5 p-4 bg-gray-200 shadow-md space-y-4">




          <div className="flex justify-center items-center mb-4">

          <button onClick={resetFilters} className="w-3/5 p-2 bg-red-500 text-white rounded">
            Reset Filters
          </button>
          </div>
          <div className="flex justify-center items-center mb-4">
          <PriceFilterBar
            items={activities}
            setItems={setFilteredActivities}
            convertedPrices={convertedPrices}
            priceProperty="price"
          />
          </div>
          <div className="flex justify-center items-center mb-50 ">
          <CategoryFilter setSelectedCategory={setCategory} baseUrl={baseUrl} />
          </div>  
          <RatingFilter setSelectedRating={setRating} />
          <DateRangeFilter setStartDate={setStartDate} setEndDate={setEndDate} />
          
          {/* Sorting Dropdown */}
          <div className="mb-4">
            <label className="block mb-2">Sort by</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose...</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="ratingAsc">Rating: Low to High</option>
              <option value="ratingDesc">Rating: High to Low</option>
            </select>
          </div>

          <button
            onClick={applyFilters}
            className="form_control"
            style={{direction: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '60px'}}
          >
            Apply Filters
          </button>
          <div className="mb-4">
            <CurrencyConverter
              prices={prices}
              setConvertedPrices={setConvertedPrices}
              setTargetCurrency={setTargetCurrency}
            />
          </div>
        </div>
      )}

      <div className="relative text-center bg-white shadow-md rounded p-6 w-2/3 mx-auto">
        <h1 className="text-2xl text-gray-600 font-bold mb-4">Available Activities</h1>
        {message && <div className="text-red-500 mb-4">{message}</div>}

        {(role === 'advertiser' || role === 'admin') && (
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

        {role !== 'advertiser' && (
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
  );
};

export default ActivitiesView;
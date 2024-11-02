// ActivitiesView.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActivitiesList from './ActivitiesList';
import CreateActivity from './CreateActivity';
import PriceFilterBar from './PriceFilterBar';
import CategoryFilter from './CategoryFilter';
import RatingFilter from './RatingFilter';
import DateRangeFilter from './DateRangeFilter';

const ActivitiesView = ({ baseUrl, role }) => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('viewActivity');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priceOrder, setPriceOrder] = useState('asc');
  const [sortOption, setSortOption] = useState('priceAsc'); // Added sort option state

  useEffect(() => {
    fetchActivities();
  }, [activeTab]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getActivity`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setActivities(response.data);
      setFilteredActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setMessage("Error fetching activities.");
    }
  };

  const applyFilters = () => {
    let filtered = [...activities];

    if (category) {
      filtered = filtered.filter(activity => activity.category === category);
    }
    if (rating) {
      filtered = filtered.filter(activity => activity.rating >= rating);
    }
    if (startDate) {
      filtered = filtered.filter(activity => new Date(activity.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(activity => new Date(activity.date) <= new Date(endDate));
    }

    setFilteredActivities(filtered);
    sortActivities(sortOption, filtered); // Sort after filtering
  };

  const sortActivities = (option, activitiesToSort) => {
    const sorted = [...activitiesToSort].sort((a, b) => {
      if (option === 'priceAsc') return a.price - b.price;
      if (option === 'priceDesc') return b.price - a.price;
      if (option === 'ratingAsc') return a.rating - b.rating;
      if (option === 'ratingDesc') return b.rating - a.rating;
      return 0; // Default case, no sorting
    });
    setFilteredActivities(sorted);
  };

  return (
    <div className="flex">
      <div className="w-1/5 p-4 bg-red-300">
        <h2 className="text-lg font-bold mb-4 bg-green-200 p-2">Filter and Sort</h2>

        <PriceFilterBar products={activities} setProducts={setFilteredActivities} />
        <CategoryFilter setSelectedCategory={setCategory} baseUrl={baseUrl} />
        <RatingFilter setSelectedRating={setRating} />
        <DateRangeFilter setStartDate={setStartDate} setEndDate={setEndDate} />

        {/* Sorting Dropdown */}
        <div className="mb-4">
          <label className="block mb-2">Sort by</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full p-2 border"
          >
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
      </div>

      <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
        <h1 className="text-2xl text-gray-600 font-bold mb-3">Available Activities</h1>

        {message && <div className="text-red-500 mb-4">{message}</div>}

        {role === 'advertiser' && (
          <>
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
            </div>

            {activeTab === 'viewActivity' ? (
              <ActivitiesList fetchActivities={fetchActivities} baseUrl={baseUrl} activities={filteredActivities} role={role} />
            ) : (
              <CreateActivity />
            )}
          </>
        )}

        {role !== 'advertiser' && (
          <ActivitiesList fetchActivities={fetchActivities} baseUrl={baseUrl} activities={filteredActivities} role={role} />
        )}
      </div>
    </div>
  );
};

export default ActivitiesView;

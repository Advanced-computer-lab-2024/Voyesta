// RatingFilter.jsx
import React, { useState } from 'react';

const RatingFilter = ({ setSelectedRating }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRatingName, setSelectedRatingName] = useState('Rating');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleRatingSelect = (rating, ratingName) => {
    setSelectedRating(rating);
    setSelectedRatingName(ratingName);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        id="dropdownRatingButton"
        data-dropdown-toggle="dropdownRating"
        className="inline-flex items-center px-3 py-2 mb-3 me-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg md:mb-0 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={toggleDropdown}
      >
        {selectedRatingName}
        <svg className="w-2 h-2 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div id="dropdownRating" className="absolute z-50 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRatingButton">
            <li>
              <button onClick={() => handleRatingSelect('', 'All')} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">All</button>
            </li>
            <li>
              <button onClick={() => handleRatingSelect('0.0', '0 Stars')} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">0 Stars</button>
            </li>
            <li>
              <button onClick={() => handleRatingSelect('1.0', '1 Star')} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">1 Star</button>
            </li>
            <li>
              <button onClick={() => handleRatingSelect('2.0', '2 Stars')} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">2 Stars</button>
            </li>
            <li>
              <button onClick={() => handleRatingSelect('3.0', '3 Stars')} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">3 Stars</button>
            </li>
            <li>
              <button onClick={() => handleRatingSelect('4.0', '4 Stars')} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">4 Stars</button>
            </li>
            <li>
              <button onClick={() => handleRatingSelect('5.0', '5 Stars')} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">5 Stars</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default RatingFilter;

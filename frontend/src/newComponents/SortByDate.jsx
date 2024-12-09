import React, { useState } from 'react';

const SortByDate = ({ sortOrder, setSortOrder }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSortName, setSelectedSortName] = useState('Sort by Date');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSortSelect = (order, sortName) => {
    setSortOrder(order);
    setSelectedSortName(sortName);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        id="dropdownSortButton"
        data-dropdown-toggle="dropdownSort"
        className="inline-flex items-center px-3 py-2 mb-3 me-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg md:mb-0 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={toggleDropdown}
      >
        {selectedSortName}
        <svg className="w-2 h-2 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div id="dropdownSort" className="absolute z-50 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSortButton">
            <li>
              <button onClick={() => handleSortSelect('asc', 'Date: Oldest to Newest')} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Date: Oldest to Newest</button>
            </li>
            <li>
              <button onClick={() => handleSortSelect('desc', 'Date: Newest to Oldest')} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Date: Newest to Oldest</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortByDate;
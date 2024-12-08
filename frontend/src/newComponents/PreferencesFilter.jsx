import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PreferencesFilter = ({ setSelectedPreferences }) => {
  const [preferences, setPreferences] = useState([]);
  const [selectedPreference, setSelectedPreference] = useState('Select Tag');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    // Fetch preferences from the database or an API
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('http://localhost:5173/api/tourist/getTags', getAuthHeaders()); // Adjust the URL to your API endpoint
        setPreferences(response.data);
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchPreferences();
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    setSelectedPreference(value);
    setSelectedPreferences(value); // Pass the selected preference up to the parent
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <button
        id="dropdownPreferenceButton"
        className="inline-flex items-center px-3 py-2 mb-3 me-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg md:mb-0 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={toggleDropdown}
      >
        {selectedPreference || 'Select Preference'}
        <svg className="w-2 h-2 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div id="dropdownPreference" className="absolute z-50 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownPreferenceButton">
            <li>
              <button onClick={() => handleChange({ target: { value: '' } })} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">--All--</button>
            </li>
            {preferences.map((preference) => (
              <li key={preference.id}>
                <button onClick={() => handleChange({ target: { value: preference.Name } })} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  {preference.Name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PreferencesFilter;
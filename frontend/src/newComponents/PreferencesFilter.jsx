// PreferencesFilter.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PreferencesFilter = ({ setSelectedPreferences }) => {
  const [preferences, setPreferences] = useState([]);
  const [selectedPreference, setSelectedPreference] = useState('');

  useEffect(() => {
    // Fetch preferences from the database or an API
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('http://localhost:5173/api/tourist/getTags'); // Adjust the URL to your API endpoint
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
  };

  return (
    <div className="mb-4">
      <label className="block mb-2">Select Preference</label>
      <select onChange={handleChange} value={selectedPreference} className="w-full p-2 border">
        <option value="">--All--</option>
        {preferences.map((preference) => (
          <option key={preference.id} value={preference.name}>{preference.name}</option>
        ))}
      </select>
    </div>
  );
};

export default PreferencesFilter;

// ActivitiesView.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActivitiesList from './ActivitiesList';

const ActivitiesView = ({ baseUrl, role}) => {
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getActivity`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setMessage("Error fetching activities.");
    }
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Available Activities</h1>

      {message && <div className="text-red-500 mb-4">{message}</div>}

      <ActivitiesList fetchActivities={fetchActivities} baseUrl={baseUrl} activities={activities} role={role} />
    </div>
  );
};

export default ActivitiesView;
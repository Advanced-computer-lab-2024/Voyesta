// ActivitiesView.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActivitiesList from './ActivitiesList';
import CreateActivity from './CreateActivity';


const ActivitiesView = ({ baseUrl, role }) => {
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('viewActivity');

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
    } catch (error) {
      console.error('Error fetching activities:', error);
      setMessage("Error fetching activities.");
    }
  };

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Available Activities</h1>

      {message && <div className="text-red-500 mb-4">{message}</div>}

      {role === 'advertiser' && (
        <>
          {/* Sub-navbar for advertiser */}
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

          {/* Content based on Active Tab */}
          {activeTab === 'viewActivity' ? (
            <ActivitiesList fetchActivities={fetchActivities} baseUrl={baseUrl} activities={activities} role={role} />
          ) : activeTab === 'createActivity' && (
            <CreateActivity getAuthHeaders={getAuthHeaders} />
          )}
        </>
      )}

      {role !== 'advertiser' && (
        <ActivitiesList fetchActivities={fetchActivities} baseUrl={baseUrl} activities={activities} role={role} />
      )}
    </div>
  );
};

export default ActivitiesView;
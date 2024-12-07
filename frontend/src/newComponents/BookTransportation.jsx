import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ActivityItem from './ActivityItem';

const BookTransportation = ({ baseUrl, role }) => {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch transportation activities from the API
    axios
      .get(`${baseUrl}/transportationActivities`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.error(
          'There was an error fetching the transportation activities!',
          error
        );
      });
  }, [baseUrl]);

  const handleSelectActivity = (activity) => {
    setSelectedActivity(activity);
  };

  const handlePay = () => {
    // Handle payment logic here
    alert('Booking successful');
    navigate('/tourist');
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 bg-gray-100 min-h-screen">
      {/* Transportation List */}
      <div className="md:w-2/3">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Transportation Options
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className={`p-6 rounded-xl shadow-lg border border-gray-300 transition-transform transform hover:scale-105 cursor-pointer ${
                selectedActivity?._id === activity._id
                  ? 'ring-4 ring-blue-500'
                  : ''
              }`}
              onClick={() => handleSelectActivity(activity)}
            >
              <ActivityItem
                activity={activity}
                role={role}
                baseUrl={baseUrl}
                transportation={true}
                fetchActivities={() => {}}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Selected Transportation Details */}
      <div className="md:w-3/4 bg-white rounded-xl shadow-lg p-8">
        {selectedActivity ? (
          <div className="md:W-1 bg-white rounded-xl shadow-lg p-8" >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {selectedActivity.name}
            </h2>
            <p className="text-gray-700 text-lg mb-8">
              Price: <span className="text-xl font-bold">${selectedActivity.price}</span>
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 text-lg rounded-xl shadow-xl transition-transform transform hover:scale-105 w-full"
              onClick={handlePay}
            >
              Confirm & Pay
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Select a transportation option
            </h3>
            <p className="text-gray-500">
              Click on any transportation activity to view details and proceed
              with booking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookTransportation;

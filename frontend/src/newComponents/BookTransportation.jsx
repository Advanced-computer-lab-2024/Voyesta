// BookTransportation.jsx
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
    axios.get(`${baseUrl}/transportationActivities`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
      .then(response => {
        setActivities(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the transportation activities!', error);
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
    <div className="flex p-6">
      <div className="w-3/5">
        <h1 className="text-2xl font-bold mb-4">Transportation Activities</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map(activity => (
            <div className='hover:shadow-2xl' key={activity._id} onClick={() => handleSelectActivity(activity)}>
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
      <div className="w-2/5 p-4 border-l border-gray-200">
        {selectedActivity ? (
          <div>
            <h2 className="text-xl font-bold mb-2">{selectedActivity.name}</h2>
            <p className="mb-4">Price: ${selectedActivity.price}</p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handlePay}
            >
              Pay
            </button>
          </div>
        ) : (
          <p>Select a transportation activity to view details and pay.</p>
        )}
      </div>
    </div>
  );
};

export default BookTransportation;
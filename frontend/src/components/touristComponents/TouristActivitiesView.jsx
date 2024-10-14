import { useState, useEffect } from 'react';
import axios from 'axios';

const ActivitiesView = () => {
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState(null);

  const baseUrl = "http://localhost:3000/api/tourist";

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getActivity`);
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

      {activities.length > 0 ? (
        activities.map((activity) => (
          <div key={activity._id} className="bg-gray-100 p-4 rounded shadow-md mb-2">
            <h3 className="font-bold text-lg">{activity.name}</h3>
            <p>{activity.description || 'No description available'}</p>
            
            {/* Handle location as an object */}
            {activity.location && typeof activity.location === 'object' ? (
              <p>Location: 
                {activity.location.address || 'Unknown address'}, 
                {activity.location.city || 'Unknown city'}, 
                {activity.location.country || 'Unknown country'}
              </p>
            ) : (
              <p>Location information not available</p>
            )}

            {/* Properly format date and time */}
            <p>Date: {activity.date ? new Date(activity.date).toLocaleDateString() : 'Unknown date'}</p>
            <p>Time: {activity.time || 'Unknown time'}</p>

            {/* Check price format */}
            {typeof activity.price === 'object' ? (
              <p>Price Range: ${activity.price.min || '0'} - ${activity.price.max || '0'}</p>
            ) : (
              <p>Price: ${activity.price || 'Unknown price'}</p>
            )}

            {/* Handle category, checking if it's an object */}
            <p>Category: {typeof activity.category === 'string' 
            ? activity.category 
            : activity.category?.Name || 'Unknown category'}
            </p>
            
            {/* Check if tags is an array before using join */}
            {Array.isArray(activity.tags) ? (
              <p>Tags: {activity.tags.join(', ')}</p>
            ) : (
              <p>Tags: No tags available</p>
            )}

            <p>Rating: {activity.rating || 'No rating available'}</p>
            
            {activity.specialDiscount && <p>Special Discount: {activity.specialDiscount}</p>}
          </div>
        ))
      ) : (
        <p>No activities found.</p>
      )}
    </div>
  );
};

export default ActivitiesView;

import { useState, useEffect } from 'react';
import axios from 'axios';

const ActivitiesView = () => {
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState(null);

  const baseUrl = "http://localhost:3000/api/tourGuide";

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getActivity`, {
        headers: {
          Authorization: `Bearer <your-token>`
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

      {activities.length > 0 ? (
        activities.map((activity) => (
          <div key={activity._id} className="bg-gray-100 p-4 rounded shadow-md mb-2">
            <h3 className="font-bold text-lg">{activity.name}</h3>
            <p>{activity.description}</p>
            
            {/* Handling location as an object */}
            {activity.location && (
              <p>Location: {activity.location.address}, {activity.location.city}, {activity.location.country}</p>
            )}

            {/* Properly formatting date and time */}
            <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
            <p>Time: {activity.time}</p>

            {/* If price is an object, render its individual properties */}
            {typeof activity.price === 'object' ? (
              <p>Price Range: ${activity.price.min} - ${activity.price.max}</p>
            ) : (
              <p>Price: ${activity.price}</p>
            )}

            <p>Category: {activity.category}</p>
            <p>Tags: {activity.tags.join(', ')}</p>
            <p>Rating: {activity.rating}</p>
            
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

import { useState, useEffect } from 'react';
import axios from 'axios';

const ActivitiesView = () => {
  const [activities, setActivities] = useState([]);
  const baseUrl = "http://localhost:3000/api/tourGuide"; // Adjust as needed

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getActivity`);
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div>
      <h1>Activities</h1>
      {activities.length > 0 ? (
        activities.map(activity => (
          <div key={activity._id}>
            <h2>{activity.name}</h2>
            {/* Add any additional activity info and functionality for updates */}
          </div>
        ))
      ) : (
        <p>No activities found.</p>
      )}
    </div>
  );
};

export default ActivitiesView;

// pages/ManageActivities.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActivityForm from '../components/ActivityForm';

const ManageActivities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Fetch activities from the backend
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/advertiser/getActivity');
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    fetchActivities();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/advertiser/deleteActivity/${id}`);
      setActivities(activities.filter(activity => activity._id !== id));
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  return (
    <div>
      <h1>Manage Activities</h1>
      <ActivityForm setActivities={setActivities} />
      <ul>
        {activities.map(activity => (
          <li key={activity._id}>
            {activity.date} - {activity.location} - {activity.price} USD
            <button onClick={() => handleDelete(activity._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageActivities;

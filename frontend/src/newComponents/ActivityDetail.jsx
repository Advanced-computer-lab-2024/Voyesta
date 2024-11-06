import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/activity/getActivity/${id}`);
        console.log(response.data);
        setActivity(response.data);
      } catch (error) {
        setMessage('Failed to fetch activity details');
      }
    };

    fetchActivity();
  }, [id]);

  if (message) {
    return <div>{message}</div>;
  }

  if (!activity) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{activity.name}</h1>
      <p>{activity.description}</p>
      <p>Location: {activity.location.lat}, {activity.location.lng}</p>
      <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
      <p>Time: {activity.time}</p>
      <p>Price: {activity.price}</p>
      <p>Special Discount: {activity.specialDiscount}%</p>
      <p>Category: {activity.category.Name}</p>
      <p>Tags: {activity.tags.map(tag => tag.Name).join(', ')}</p>
      <p>Ratings: {activity.ratings.map(rating => ` ${rating.rating}`).join(', ')}</p>
      <p>Comments: {activity.comments.map(comment => ` ${comment.comment}`).join(', ')}</p>
    </div>
  );
};

export default ActivityDetail;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ActivityItem from './ActivityItem';

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
    <div className='w-4/5 mx-auto my-auto mt-32'>
      <ActivityItem activity={activity} />
    </div>
  );
};

export default ActivityDetail;
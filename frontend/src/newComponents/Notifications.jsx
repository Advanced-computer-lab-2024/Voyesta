import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = ({ baseUrl, userType, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getNotifications`, getAuthHeaders(), { userType: userType, userId: userId});
        console.log(response);
        setNotifications(response.data);
      } catch (error) {
        setError('Failed to fetch notifications');
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [baseUrl, userType, userId]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-disc list-inside">
        {notifications.map((notification, index) => (
          <li key={index} className="mb-2">
            <p>{notification.message}</p>
            <p className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
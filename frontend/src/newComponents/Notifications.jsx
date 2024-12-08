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

        if (!sessionStorage.getItem('reloaded')) {
          sessionStorage.setItem('reloaded', 'true');
          window.location.reload();
        }


      } catch (error) {
        setError('Failed to fetch notifications');
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  
  }, [baseUrl, userType, userId]);

  return (
    <section className="bg-white py-8 antialiased min-h-screen dark:bg-gray-900 md:py-16">
    <div className="mx-auto max-w-screen-lg px-4 2xl:px-0">
      <div className="lg:flex lg:items-center lg:justify-between lg:gap-4">
        <h2 className="shrink-0 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Notifications</h2>
      </div>
      <div className="mt-6 flow-root">
        <div className="-my-6 divide-y divide-gray-200 dark:divide-gray-800">
          {error && <p className="text-red-500">{error}</p>}
          {notifications.map((notification, index) => (
            <div key={index} className="space-y-4 py-6 md:py-8">
              <div className="grid gap-4">
                <a href="#" className="text-xl font-semibold text-gray-900 hover:underline dark:text-white">{notification.message}</a>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
  );
};

export default Notifications;
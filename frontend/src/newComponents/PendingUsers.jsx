import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';

const PendingUsers = ({ baseUrl }) => {
  const [users, setUsers] = useState([]);
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Fetch pending users from the API
    axios.get(`${baseUrl}/pending-users`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the pending users!', error);
      });
  }, [baseUrl]);

  const handleViewClick = (url) => {
    // window.open(url, '_blank');
    setUrl(url);
  };

  const handleAccept = (userId) => {
    // Handle accept logic here
    axios.patch(`${baseUrl}/setStatusToActive/${userId}`).
    then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('There was an error accepting the user!', error);
    });
    // console.log(`Accepted user with ID: ${userId}`);
  };

  const handleReject = (userId) => {
    // Handle reject logic here
    axios.patch(`${baseUrl}/setStatusToRejected/${userId}`).
    then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('There was an error rejecting the user!', error);
    });
    // console.log(`Rejected user with ID: ${userId}`);
  };

  return (
    <div className='flex'>
      <div className="p-6 w-3/5">
        <h1 className="text-2xl font-bold mb-4">Pending Users</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">User Type</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Personal ID</th>
                <th className="py-2 px-4 border-b">Additional Document</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-100 text-center">
                  <td className="py-2 px-4 border-b">{user.userType}</td>
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">
                    {user.personalId ? (
                      <button
                        className="text-blue-500 underline"
                        onClick={() => handleViewClick(user.personalId)}
                      >
                        View
                      </button>
                    ) : 'No'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {user.additionalDocument ? (
                      <button
                        className="text-blue-500 underline"
                        onClick={() => handleViewClick(user.additionalDocument)}
                      >
                        View
                      </button>
                    ) : 'No'}
                  </td>
                  <td className="py-2 px-4 flex justify-center space-x-4">
                    {(user.additionalDocument && user.personalId ) && <>
                    <FaCheck
                      className="text-green-500 cursor-pointer"
                      onClick={() => handleAccept(user.id)}
                    />
                    <FaTimes
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleReject(user.id)}
                    />
                    </>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='w-2/5'>
        {url && (
          <img src={url} alt="Document" className="w-full h-full" />
        )}
      </div>
    </div>
  );
};

export default PendingUsers;
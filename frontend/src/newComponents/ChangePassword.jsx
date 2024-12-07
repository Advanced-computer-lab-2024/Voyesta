import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = ({ baseUrl }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.patch(`${baseUrl}/changePassword`, {
        oldPassword,
        newPassword,
        confirmNewPassword
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage(response.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      setMessage(error.response.data.message || 'Error changing password');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden p-6">
      <div className="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
        <svg className="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span className="sr-only">Info</span>
        <div>
          <span className="font-medium">Ensure that these requirements are met:</span>
          <ul className="mt-1.5 list-disc list-inside">
            <li>At least 8 characters</li>
            <li>At least one uppercase character</li>
            <li>Inclusion of at least one special character, e.g., ! @ # ?</li>
          </ul>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="oldPassword" className="block mb-2 text-sm font-medium text-gray-900">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            placeholder='Enter old password'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900">New Password</label>
          <input
            type="password"
            id="newPassword"
            placeholder='Enter new password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmNewPassword" className="block mb-2 text-sm font-medium text-gray-900">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPassword"
            placeholder='Confirm new password'
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full md:w-auto rounded-lg bg-blue-600 py-3 px-6 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-blue-700"
          >
            Change Password
          </button>
        </div>
      </form>
      {message && (
        <div className={`flex items-center p-4 mt-4 text-sm rounded-lg ${message.includes('successfully') ? 'text-green-800 border border-green-300 bg-green-50 dark:text-green-400 dark:border-green-800' : 'text-red-800 border border-red-300 bg-red-50 dark:text-red-400 dark:border-red-800'}`} role="alert">
          <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">{message.includes('successfully') ? 'Success!' : 'Error!'}</span> {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
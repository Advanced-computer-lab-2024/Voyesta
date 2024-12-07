import React, { useState } from 'react';
import axios from 'axios';

const CreateTag = ({ baseUrl, title }) => {
  const [tagName, setTagName] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/addTag`,
        { Name: tagName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessage(`Tag created successfully: ${response.data.Name}`);
      setTagName('');
    } catch (error) {
      setMessage(`Error creating tag: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="w-1/3 mx-auto p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">{title}</h1>

        {/* Alert Box */}
        {message && (
          <div
            className={`flex items-center p-4 mt-4 text-sm rounded-lg ${
              message.includes('successfully')
                ? 'text-green-800 border border-green-300 bg-green-50 dark:text-green-400 dark:border-green-800'
                : 'text-red-800 border border-red-300 bg-red-50 dark:text-red-400 dark:border-red-800'
            }`}
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 1 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">
                {message.includes('successfully') ? 'Success!' : 'Error!'}
              </span>{' '}
              {message}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="mb-5">
          <label
            htmlFor="tagName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Tag Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <i className="fas fa-tag w-4 h-4 text-gray-500 dark:text-gray-400"></i>
            </div>
            <input
              type="text"
              id="tagName"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Enter tag name"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
            />
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateTag;

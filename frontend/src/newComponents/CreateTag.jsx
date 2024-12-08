import React, { useState } from 'react';
import axios from 'axios';

const CreateTag = ({ baseUrl, title, fetchTags }) => {
  const [tagName, setTagName] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/addTag`, { Name: tagName }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage(`Tag created successfully: ${response.data.Name}`);
      setTagName('');
      fetchTags();
    } catch (error) {
      setMessage(`Error creating tag: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="h-full mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {message && <div className="mb-4 text-red-500">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tagName">
            Tag Name
          </label>
          <input
            type="text"
            id="tagName"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Create Tag
        </button>
      </form>
    </div>
  );
};

export default CreateTag;
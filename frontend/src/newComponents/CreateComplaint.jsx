import React, { useState } from 'react';
import axios from 'axios';

const CreateComplaint = ({ baseUrl, onComplaintCreated }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/createComplaint`, { title, body }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage('Complaint created successfully.');
      setTitle('');
      setBody('');
      onComplaintCreated(); // Call the callback to refresh the complaints list
    } catch (error) {
      setMessage('Error creating complaint.');
      console.error('Error creating complaint:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Create Complaint</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">Body</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      {message && (
        <p className={`mt-4 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default CreateComplaint;
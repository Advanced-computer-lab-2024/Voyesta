import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateActivity from './CreateActivity'; // Import your CreateActivity component

const ActivityManagement = () => {
  const [activeTab, setActiveTab] = useState('viewActivity');
  const [activity, setActivity] = useState(null);

  // Form fields for view/edit activity
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [specialDiscounts, setSpecialDiscounts] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [message, setMessage] = useState(null);

  const baseUrl = 'http://localhost:3000/api/advertiser'; // Adjust this based on your backend

  useEffect(() => {
    if (activeTab === 'viewActivity' || activeTab === 'editActivity') {
      fetchActivity();
    }
  }, [activeTab]);

  // Fetch the activity details
  const fetchActivity = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getActivity`, {headers: {
        Authorization: `Bearer `
      }});
      setActivity(response.data);

      // Set the form values for edit mode
      if (response.data) {
        setName(response.data.name);
        setDescription(response.data.description);
        setDate(response.data.date);
        setTime(response.data.time);
        setLocation(response.data.location);
        setPrice(response.data.price);
        setCategory(response.data.category);
        setTags(response.data.tags.join(', ')); // Assuming tags are stored as an array
        setSpecialDiscounts(response.data.specialDiscounts);
        setBookingOpen(response.data.bookingOpen);
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
      setMessage('Error fetching activity.');
    }
  };

  const handleUpdateActivity = async (e) => {
    e.preventDefault();

    const updatedActivityData = {
      name,
      description,
      date,
      time,
      location,
      price: parseFloat(price),
      category,
      tags: tags.split(',').map((tag) => tag.trim()),
      specialDiscounts,
      bookingOpen,
    };

    try {
      await axios.put(`${baseUrl}/update`, updatedActivityData);
      setMessage('Activity updated successfully.');
      fetchActivity(); // Refetch the activity details after update
    } catch (error) {
      console.error('Error updating activity:', error);
      setMessage('Error updating activity.');
    }
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Activity Management</h1>

      {/* Tab Navigation */}
      <div className="flex justify-around border-b mb-4">
        <button
          className={`p-2 ${activeTab === 'viewActivity' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('viewActivity')}
        >
          View Activity
        </button>
        <button
          className={`p-2 ${activeTab === 'editActivity' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('editActivity')}
        >
          Edit Activity
        </button>
        <button
          className={`p-2 ${activeTab === 'createActivity' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('createActivity')}
        >
          Create Activity
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'viewActivity' && activity ? (
        <div>
          <p>
            <strong>Name:</strong> {activity.name}
          </p>
          <p>
            <strong>Description:</strong> {activity.description}
          </p>
          <p>
            <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Time:</strong> {activity.time}
          </p>
          <p>
            <strong>Location:</strong> {activity.location}
          </p>
          <p>
            <strong>Price:</strong> ${activity.price}
          </p>
          <p>
            <strong>Category:</strong> {activity.category}
          </p>
          <p>
            <strong>Tags:</strong> {activity.tags.join(', ')}
          </p>
          <p>
            <strong>Special Discounts:</strong> {activity.specialDiscounts}
          </p>
          <p>
            <strong>Booking Open:</strong> {activity.bookingOpen ? 'Yes' : 'No'}
          </p>
        </div>
      ) : activeTab === 'viewActivity' ? (
        <p>Loading...</p>
      ) : activeTab === 'editActivity' ? (
        <form onSubmit={handleUpdateActivity} className="flex flex-col gap-4">
          {/* Form fields for editing activity - consistent with CreateActivity */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="specialDiscounts" className="block text-sm font-medium text-gray-700">
              Special Discounts
            </label>
            <input
              type="text"
              id="specialDiscounts"
              value={specialDiscounts}
              onChange={(e) => setSpecialDiscounts(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="bookingOpen" className="block text-sm font-medium text-gray-700">
              Booking Open
            </label>
            <input
              type="checkbox"
              id="bookingOpen"
              checked={bookingOpen}
              onChange={(e) => setBookingOpen(e.target.checked)}
              className="ml-2"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
          >
            Update Activity
          </button>
        </form>
      ) : activeTab === 'createActivity' && (
        <CreateActivity baseUrl={baseUrl} />
      )}

      {/* Display Message */}
      {message && (
        <p className={`mt-4 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ActivityManagement;

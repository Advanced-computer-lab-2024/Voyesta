import React, { useEffect, useState } from 'react';
import axios from 'axios';


const CreateActivity = (props) => {


  const [activity, setActivity] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: {
      lat: '',
      lng: ''
    },
    price: '',
    category: '',
    tags: [],
    specialDiscounts: '',
    bookingOpen: false,
    imageUrl: '' // Add this line
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState(null);

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/advertiser/getActivityCategories", getAuthHeaders())
    .then(res => {
      const categoryNames = res.data.map(category => category.Name);
      setCategories(categoryNames);
      console.log(categoryNames);
    })
    .catch(err => console.log(err));

    axios.get("http://localhost:3000/api/advertiser/getPreferenceTags", getAuthHeaders())
    .then(res => {
      const tagNames = res.data.map(tag => tag.Name);
      setTags(tagNames);
      console.log(tagNames);
    })
    .catch(err => console.log(err));

    
  }, []);

  const handleChange = (e) => {
    const { id, value, options } = e.target;
    if (id === 'latitude' || id === 'longitude') {
      // Allow empty input or valid float numbers
      if (value === '' || !isNaN(value)) {
        setActivity((prevActivity) => ({
          ...prevActivity,
          location: {
            ...prevActivity.location,
            [id === 'latitude' ? 'lat' : 'lng']: value
          }
        }));
      }
    } else if(id === 'tags'){
      const selectedTags = Array.from(options).filter(option => option.selected).map(option => option.value);
      console.log(selectedTags);
      setActivity(prevState => ({
        ...prevState,
        [id]: selectedTags
      }));
    }else {
      setActivity((prevActivity) => ({
        ...prevActivity,
        [id]: value
      }));
    }
  };

  const handleCreateActivity = (e) => {
    e.preventDefault();
    const activityData = {
      ...activity,
      price: isNaN(parseFloat(activity.price))
        ? (() => {
            const [min, max] = activity.price.split('-').map(val => parseFloat(val.trim()));
            return { min, max };
          })()
        : parseFloat(activity.price),
      location: {
        lat: parseFloat(activity.location.lat),
        lng: parseFloat(activity.location.lng)
      },
      specialDiscounts: parseFloat(activity.specialDiscounts),
    };

    console.log(activityData);
    
    // Handle activity creation logic here
    axios.post("http://localhost:3000/api/advertiser/createActivity", activityData, getAuthHeaders())
      .then(res => {
        console.log(res);
        setMessage("Activity created successfully!");
      })
      .catch(err => {
        console.log(err);
        setMessage("Error creating activity: " + err.message);
      });
  };

  return (
    <form onSubmit={handleCreateActivity} className="flex flex-col gap-4 w-2/3 mx-auto">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={activity.name}
          onChange={handleChange}
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
          value={activity.description}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="text"
          id="imageUrl"
          value={activity.imageUrl}
          onChange={handleChange}
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
          value={activity.date}
          onChange={handleChange}
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
          value={activity.time}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <div className="flex gap-4">
          <div className='w-1/2'>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              type="text"
              id="latitude"
              value={activity.location.lat}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
              required
            />
          </div>
          <div className='w-1/2'>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="text"
              id="longitude"
              value={activity.location.lng}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="text"
          id="price"
          value={activity.price}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={activity.category}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        >
          <option disabled value="">Select a category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <select
          id="tags"
          name="tags"
          multiple
          value={activity.tags}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
        >
          {tags.map((tag, index) => (
            <option key={index} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="specialDiscounts" className="block text-sm font-medium text-gray-700">
          Special Discounts
        </label>
        <input
          type="text"
          id="specialDiscounts"
          value={activity.specialDiscounts}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
        />
      </div>

      <div className="flex justify-center">
        <input
          type="checkbox"
          id="bookingOpen"
          checked={activity.bookingOpen}
          onChange={(e) => setActivity({ ...activity, bookingOpen: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="bookingOpen" className="ml-2 block text-sm text-gray-900">
          Booking Open
        </label>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
      >
        Create Activity
      </button>

      {message && (
        <p className={`${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </form>
  );
};

export default CreateActivity;

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create New Activity</h2>
        <form onSubmit={handleCreateActivity} className="space-y-6 text-left">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="name"
              id="name"
              value={activity.name}
              onChange={(e) => setActivity({ ...activity, name: e.target.value })}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Name
            </label>
          </div>
  
          <div className="relative z-0 w-full mb-5 group">
            <textarea
              name="description"
              id="description"
              value={activity.description}
              onChange={(e) => setActivity({ ...activity, description: e.target.value })}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="description"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Description
            </label>
          </div>
  
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="imageUrl"
              id="imageUrl"
              value={activity.imageUrl}
              onChange={(e) => setActivity({ ...activity, imageUrl: e.target.value })}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="imageUrl"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Image URL
            </label>
          </div>
  
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="date"
              name="date"
              id="date"
              value={activity.date}
              onChange={(e) => setActivity({ ...activity, date: e.target.value })}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="date"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Date
            </label>
          </div>
  
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="time"
              name="time"
              id="time"
              value={activity.time}
              onChange={(e) => setActivity({ ...activity, time: e.target.value })}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="time"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Time
            </label>
          </div>
  
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="latitude"
              id="latitude"
              value={activity.location.lat}
              onChange={(e) => setActivity({ ...activity, location: { ...activity.location, lat: e.target.value } })}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="latitude"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Latitude
            </label>
          </div>
  
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="longitude"
              id="longitude"
              value={activity.location.lng}
              onChange={(e) => setActivity({ ...activity, location: { ...activity.location, lng: e.target.value } })}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="longitude"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Longitude
            </label>
          </div>
  
          
  
          <div className="relative z-0 w-full mb-5 group">
            <label
              htmlFor="category"
              className="block text-sm text-gray-500 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={activity.category}
              onChange={(e) => setActivity({ ...activity, category: e.target.value })}
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
  
          <div className="relative z-0 w-full mb-5 group">
            <label
              htmlFor="tags"
              className="block text-sm text-gray-500 mb-2"
            >
              Tags
            </label>
            <select
              id="tags"
              name="tags"
              multiple
              value={activity.tags}
              onChange={(e) => setActivity({ ...activity, tags: Array.from(e.target.selectedOptions, option => option.value) })}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            >
              {tags.map((tag, index) => (
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <label
              htmlFor="price"
              className="block text-sm text-gray-500 mb-2"
            >
              Price
            </label>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setActivity({ ...activity, price: activity.price > 0 ? activity.price - 1 : 0 })}
                className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-2 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
              >
                <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                </svg>
              </button>
              <input
                type="text"
                name="price"
                id="price"
                value={activity.price}
                onChange={(e) => setActivity({ ...activity, price: Number(e.target.value) })}
                className="bg-gray-50 border-x-0 border-gray-300 h-8 text-center text-blue-600 text-sm focus:ring-blue-500 focus:border-blue-500 block w-12 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="0"
                required
                style={{ '-webkit-appearance': 'none', '-moz-appearance': 'textfield' }}
              />
              <button
                type="button"
                onClick={() => setActivity({ ...activity, price: activity.price + 1 })}
                className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-2 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
              >
                <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                </svg>
              </button>
            </div>
          </div>
  
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="specialDiscounts"
              id="specialDiscounts"
              value={activity.specialDiscounts}
              onChange={(e) => setActivity({ ...activity, specialDiscounts: e.target.value })}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="specialDiscounts"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Special Discounts
            </label>
          </div>
          
  
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="checkbox"
              name="bookingOpen"
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
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create Activity
          </button>
  
          {message && (
            <p className={`mt-2 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateActivity;

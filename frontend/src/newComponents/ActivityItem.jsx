// ActivityItem.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';
import BookingPopup from './BookingPopup';
import { useNavigate } from 'react-router-dom';

const ActivityItem = ({ fetchActivities, activity, role, baseUrl, convertedPrice, targetCurrency, transportation }) => {
  const [shareLink, setShareLink] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState(activity);
  const [mappedTags, setMappedTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(activity.isBookmarked );
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (activity.tags && Array.isArray(activity.tags)) {
      const mappedTags = activity.tags.map(tag => tag.Name);
      setEditedActivity(prevState => ({
        ...prevState,
        tags: mappedTags
      }));
      setMappedTags(mappedTags);
    }
  }, [activity.tags]);

  useEffect(() => {
    axios.get(`${baseUrl}/getCategory`, getAuthHeaders())
    .then(res =>{
      const categoryNames = res.data.map(category => category.Name);
      setCategories(res.data);
    })
    .catch(err => console.log(err));

    axios.get(`${baseUrl}/getTags`, getAuthHeaders())
    .then(res => {
      const tagNames = res.data.map(tag => tag.Name);
      setTags(tagNames);
    })
    .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    // Fetch bookmark status when the component mounts
    const fetchBookmarkStatus = async () => {
      try {
        const response = await axios.get(`${baseUrl}/bookmarked-activities`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const bookmarkedActivities = response.data.map(activity => activity._id);
        if (bookmarkedActivities.includes(activity._id)) {
          setIsBookmarked(true);
        } else {
          setIsBookmarked(false);
        }
      } catch (error) {
        console.error('Error fetching bookmark status:', error);
      }
    };

    fetchBookmarkStatus();
  }, [activity._id, baseUrl]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const convertTimeTo24HourFormat = (time) => {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  const convertDateToInputFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedActivity(activity);
  };

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    console.log(name, value);
    if (name === 'tags') {
      const selectedTags = Array.from(options).filter(option => option.selected).map(option => option.value);
      setEditedActivity({ ...editedActivity, [name]: selectedTags });
    } else {
      setEditedActivity({ ...editedActivity, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const activityData = {
      ...editedActivity,
      price: isNaN(parseFloat(editedActivity.price))
        ? (() => {
            const [min, max] = editedActivity.price.split('-').map(val => parseFloat(val.trim()));
            return { min, max };
          })()
        : parseFloat(editedActivity.price),
      location: {
        lat: parseFloat(editedActivity.location.lat),
        lng: parseFloat(editedActivity.location.lng)
      },
      specialDiscounts: parseFloat(editedActivity.specialDiscounts),
    };
    console.log(activityData);
    try {
      const url = `${baseUrl}/updateActivity/${activity._id}`;
      await axios.put(url, activityData, getAuthHeaders());
      fetchActivities();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const url = `${baseUrl}/deleteActivity/${id}`;
      await axios.delete(url, getAuthHeaders());
      fetchActivities();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async (eventDate) => {
    try {
      console.log(baseUrl);
      const url = `${baseUrl}/bookEvent/${activity._id}`;
      await axios.post(url, { bookableModel: 'Activity', eventDate }, getAuthHeaders());
      alert('Booking successful!');
      setShowPopup(false);
      navigate('/tourist/bookings');
    } catch (error) {
      console.error('Error booking activity:', error);
      alert('Error booking activity.');
    }
  };
  const handleBookmark = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/bookmark`,
        { activityId: activity._id },
        getAuthHeaders()
      );
      setIsBookmarked(true); // Update UI
      alert(response.data.message);
    } catch (error) {
      console.error('Error bookmarking activity:', error);
    }
  };
  const handleUnbookmark = async () => {
    try {
      const response = await axios.delete(`${baseUrl}/bookmark/${activity._id}`, getAuthHeaders());
      setIsBookmarked(false);
      alert(response.data.message);
    } catch (error) {
      console.error('Error unbookmarking activity:', error);
    }
  };
  const toggleBookmark = () => {
    if (isBookmarked) {
      handleUnbookmark();
    } else {
      handleBookmark();
    }
  };

  const averageRating = activity.ratings.length === 0
    ? 0
    : (activity.ratings.reduce((acc, curr) => acc + curr.rating, 0) / activity.ratings.length).toFixed(1);

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md mb-2">
      {isEditing ? (
        <>
          <div className=''>
            <input
              type="text"
              name="name"
              value={editedActivity.name}
              onChange={handleChange}
              className="font-bold text-lg"
            />
          </div>
          <div>
            <textarea
              name="description"
              value={editedActivity.description}
              onChange={handleChange}
              className="w-full mt-2"
            />
          </div>
          <div>
            <input
              type="date"
              name="date"
              value={convertDateToInputFormat(editedActivity.date)}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="time"
              name="time"
              value={convertTimeTo24HourFormat(editedActivity.time)}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
                type="text"
                name="lat"
                value={editedActivity.location.lat}
                onChange={(e) => setEditedActivity({
                  ...editedActivity,
                  location: { ...editedActivity.location, lat: e.target.value }
                })}
                placeholder="Latitude"
              />
              <input
                type="text"
                name="lng"
                value={editedActivity.location.lng}
                onChange={(e) => setEditedActivity({
                  ...editedActivity,
                  location: { ...editedActivity.location, lng: e.target.value }
                })}
                placeholder="Longitude"
              />
          </div>    
          <div>
            <input
              type="text"
              name="price"
              value={editedActivity.price}
              onChange={handleChange}
              placeholder="Price"
            />
          </div>
          <div>
          <select
            name="category"
            value={editedActivity.category?.Name}
            onChange={handleChange}
            defaultValue={editedActivity.category?.Name}
          >
            <option disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.Name} value={category.Name}>
                {category.Name}
              </option>
            ))}
          </select>
          </div>
          <div>
            <select
              name="tags"
              multiple
              value={editedActivity.tags}
              onChange={handleChange}
              className='w-full'
            >
              {tags.map((tag, index) => (
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="text"
              name="specialDiscount"
              value={editedActivity.specialDiscount}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 mt-2 h-8">
            <img
              onClick={handleSubmit}
              src={assets.submitIcon}
              className="w-9 h-9 cursor-pointer absolute buttom-2 right-6"
            />
            <img
              onClick={handleCancel}
              src={assets.cancelIcon}
              className="w-7 h-7 cursor-pointer absolute buttom-2 left-6"
            />
          </div>
        </>
      ) : (
        <>
          <h3 className="font-bold text-lg">{activity.name}</h3>
          <p>{activity.description || 'No description available'}</p>
          
          {activity.location && typeof activity.location === 'object' ? (
            <p>Location: 
              {activity.location.lat || 'Unknown latitude'}, 
              {activity.location.lng || 'Unknown longitude'}
            </p>
          ) : (
            <p>Location information not available</p>
          )}

          <p>Date: {activity.date ? new Date(activity.date).toLocaleDateString() : 'Unknown date'}</p>
          <p>Time: {activity.time || 'Unknown time'}</p>

          {typeof activity.price === 'object' ? (
            <p>Price Range: {convertedPrice ? `${convertedPrice.min.toFixed(2)} - ${convertedPrice.max.toFixed(2)} ${targetCurrency}` : `${activity.price.min || '0'} - ${activity.price.max || '0'} USD`}</p>
          ) : (
            <p>Price: {convertedPrice ? `${convertedPrice.toFixed(2)} ${targetCurrency}` : `${activity.price.toFixed(2)} USD`}</p>
          )}

          <p>Category: {typeof activity.category === 'string' 
            ? activity.category 
            : activity.category?.Name || 'Unknown category'}
          </p>
          
          
          {Array.isArray(activity.tags) ? (
            !transportation && <p>Tags: {mappedTags.join(', ')}</p>
          ) : (
            <p>Tags: No tags available</p>
          )}

          <p>Rating: {averageRating}</p>
          <p>Special Discount: {activity.specialDiscount}</p>
          

          {(role === 'tourist' && (!transportation)) && (
            <>
              <button onClick={() => setShowPopup(true)} className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700">
                Book Activity
              </button>
              <button onClick={() => {
                const link = generateShareLink(activity._id);
                handleCopyLink(link);
              }} className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700">
                Share via Copy Link
              </button>
              <button onClick={() => {
                const link = generateShareLink(activity._id);
                handleShareViaEmail(link);
              }} className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700">
                Share via Email
              </button>
              <button
                onClick={toggleBookmark}
                className="flex items-center gap-2 mt-2 bg-yellow-300 rounded-full p-2 hover:bg-yellow-400"
              >
                {isBookmarked ? 'Unbookmark' : 'Bookmark'}
              </button>
              {showPopup && (
                <BookingPopup
                  item={activity}
                  itemType="activity"
                  onClose={() => setShowPopup(false)}
                  onBook={handleBooking}
                />
              )}
            </>
          )}
          

          {role === 'advertiser' && (
            <div className="flex gap-2 mt-2 h-6">

              <img
                onClick={handleEdit}
                src={assets.editIcon}
                className="w-6 h-6 cursor-pointer absolute buttom-0 right-6"
              />
              <img
                onClick={() => handleDelete(activity._id)}
                src={assets.deleteIcon}
                className="w-6 h-6 cursor-pointer absolute buttom-0 left-6"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActivityItem;
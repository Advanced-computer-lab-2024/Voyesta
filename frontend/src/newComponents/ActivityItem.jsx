// ActivityItem.jsx
import React, { act, useEffect, useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';
import BookingPopup from './BookingPopup';
import { useNavigate , useLocation} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt, faEnvelope, faBookmark, faFlag } from '@fortawesome/free-solid-svg-icons';
import { Snackbar } from '@mui/material';

const ActivityItem = ({ fetchActivities, activity, role, baseUrl, convertedPrice, targetCurrency, transportation, setSuccessMessage }) => {
  const [shareLink, setShareLink] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState(activity);
  const [mappedTags, setMappedTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(activity.isBookmarked );
  const [showPopup, setShowPopup] = useState(false);
  const [inappropriate, setInappropriate] = useState(activity.inappropriate);
  const [bookingEnabled, setBookingEnabled] = useState(activity.bookingEnabled);
  const navigate = useNavigate();
  const location = useLocation();

  

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
    axios.get(`${baseUrl}/getActivityCategories`, getAuthHeaders())
    .then(res =>{
      const categoryNames = res.data.map(category => category.Name);
      setCategories(res.data);
    })
    .catch(err => console.log(err));

    axios.get(`${baseUrl}/getPreferenceTags`, getAuthHeaders())
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
        const response = await axios.get(`${baseUrl}/bookmarked-items`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const bookmarkedActivities = response.data.activities.map(activity => activity._id);
        if (bookmarkedActivities.includes(activity._id)) {
          setIsBookmarked(true);
        } else {
          setIsBookmarked(false);
        }
      } catch (error) {
        console.error('Error fetching bookmark status:', error);
      }
    };

    const fetchBookingEnabledStatus = async () => {
      try {
        const response = await axios.get(`${baseUrl}/${activity._id}/booking-status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log(response.data);
        setBookingEnabled(response.data.bookingEnabled);
      } catch (error) {
        console.error('Error fetching booking enabled status:', error);
      }
    };

    fetchBookmarkStatus();
    fetchBookingEnabledStatus();
  }, [activity._id, baseUrl]);

  const toggleBookingEnabled = async () => {
    try {
      const url = `${baseUrl}/updateBookingEnabled/${activity._id}`;
      await axios.patch(url, { bookingEnabled: !bookingEnabled }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBookingEnabled(!bookingEnabled);
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const flagAsInappropriate = async () => {

    try {
      if(activity.inappropriate){
        return;
      }
      const url = `${baseUrl}/flagActivityAsInappropriate/${activity._id}`;
      await axios.patch(url, {}, getAuthHeaders());

      const notificationUrl = `${baseUrl}/sendNotification`;
      const message = `Your activity "${activity.name}" has been flagged as inappropriate.`;
      await axios.post(notificationUrl, { userType: 'advertiser', itemId: activity._id, message }, getAuthHeaders());

      setInappropriate(true);
      fetchActivities();
    } catch (error) {
      console.log(error);
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
     
    } catch (error) {
      console.error('Error bookmarking activity:', error);
    }
  };

  const handleUnbookmark = async () => {
    try {
      const response = await axios.delete(`${baseUrl}/bookmark/${activity._id}`, getAuthHeaders());
      setIsBookmarked(false);
      
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
    if (name === "tags") {
      const selectedTags = Array.from(options).filter(option => option.selected).map(option => option.value);
      setEditedActivity({
        ...editedActivity,
        [name]: selectedTags
      });
    } else {
      setEditedActivity({
        ...editedActivity,
        [name]: value
      });
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
    window.location.reload();
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
      navigator.clipboard.writeText(link)
      .then(() => {
        setSuccessMessage('Booking successful');
        setTimeout(() => {
          setSuccessMessage(''); // Clear the success message after 3 seconds
        }, 3000);
      })
      setShowPopup(false);

      const returnToGuide = localStorage.getItem('returnToGuide');
      const fromGuide = location.state?.fromGuide;
      if (returnToGuide && fromGuide) {
        localStorage.setItem('completedBooking', 'true');
        navigate('/tourist/guide');
      } else {
        navigate('/tourist/bookings');
      }
    } catch (error) {
      console.error('Error booking activity:', error);
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link)
      .then(() => {
        setSuccessMessage('Link copied to clipboard!');
        setTimeout(() => {
          setSuccessMessage(''); // Clear the success message after 3 seconds
        }, 3000);
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
      });
  };

  const handleShareViaEmail = (link) => {
    window.location.href = `mailto:?subject=Check out this activity&body=Here is the link: ${link}`;
  };

  const generateShareLink = (id) => {
    return `${window.location.origin}/activity/${id}`;
  };

  const averageRating = activity.ratings.length === 0
    ? 0
    : (activity.ratings.reduce((acc, curr) => acc + curr.rating, 0) / activity.ratings.length).toFixed(1);

  const fallbackImage = "https://cdn.britannica.com/10/241010-049-3EB67AA2.jpg";

  const handleNotifyMe = async () => {
    try {
      const url = `${baseUrl}/requestNotification`;
      await axios.post(url, { itemId: activity._id, itemType: 'activity' }, getAuthHeaders());
    } catch (error) {
      console.error('Error requesting notification:', error);
    }
  };

  return (
    <div className="activity-item flex flex-col h-full overflow-hidden hover:scale-105 transition-transform duration-300 mb-6">
  {isEditing ? (
  <>
    <div className="relative z-0 w-full mb-5 group">
      <input
        type="text"
        name="name"
        value={editedActivity.name}
        onChange={handleChange}
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
        value={editedActivity.description}
        onChange={handleChange}
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
        type="date"
        name="date"
        value={convertDateToInputFormat(editedActivity.date)}
        onChange={handleChange}
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
        value={convertTimeTo24HourFormat(editedActivity.time)}
        onChange={handleChange}
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
        name="lat"
        value={editedActivity.location.lat}
        onChange={(e) => setEditedActivity({
          ...editedActivity,
          location: { ...editedActivity.location, lat: e.target.value }
        })}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
      />
      <label
        htmlFor="lat"
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Latitude
      </label>
    </div>

    <div className="relative z-0 w-full mb-5 group">
      <input
        type="text"
        name="lng"
        value={editedActivity.location.lng}
        onChange={(e) => setEditedActivity({
          ...editedActivity,
          location: { ...editedActivity.location, lng: e.target.value }
        })}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
      />
      <label
        htmlFor="lng"
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Longitude
      </label>
    </div>

    <div className="relative z-0 w-full mb-5 group">
      <input
        type="text"
        name="price"
        value={editedActivity.price}
        onChange={handleChange}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
      />
      <label
        htmlFor="price"
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Price
      </label>
    </div>

    <div className="relative z-0 w-full mb-5 group">
      <select
        name="category"
        value={editedActivity.category?.Name}
        onChange={handleChange}
        defaultValue={editedActivity.category?.Name}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        required
      >
        <option disabled>Select a category</option>
        {categories.map((category) => (
          <option key={category.Name} value={category.Name}>
            {category.Name}
          </option>
        ))}
      </select>
      <label
        htmlFor="category"
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Category
      </label>
    </div>

    <div className="relative z-0 w-full mb-5 group">
        <select
          name="tags"
          multiple
          value={editedActivity.tags}
          onChange={handleChange}
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
        >
          {tags.map((tag, index) => (
            <option key={index} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <label
          htmlFor="tags"
          className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Tags
        </label>
      </div>

    <div className="relative z-0 w-full mb-5 group">
      <input
        type="text"
        name="specialDiscount"
        value={editedActivity.specialDiscount}
        onChange={handleChange}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
      />
      <label
        htmlFor="specialDiscount"
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Special Discount
      </label>
    </div>

    <div className="flex justify-between mt-2 h-8">
      <img
        onClick={handleSubmit}
        src={assets.submitIcon}
        className="w-9 h-9 cursor-pointer"
      />
      <img
        onClick={handleCancel}
        src={assets.cancelIcon}
        className="w-7 h-7 cursor-pointer"
      />
    </div>
  </>
) : (
        <>
          <div className="activity-item flex flex-col h-full">
          <img 
    src={fallbackImage} 
    alt={activity.name} 
    className="w-full h-48 object-cover"
  />
  <div className="p-4 flex flex-col space-y-3">
    {/* Activity Name */}
    <h3 className="font-bold text-xl text-gray-800">{activity.name}</h3>
  
    {/* Tags */}
    {Array.isArray(activity.tags) && activity.tags.length > 0 ? (
      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-800">Tags:</span> {mappedTags.join(', ')}
      </p>
    ) : (
      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-800">Tags:</span> No tags available
      </p>
    )}
  
    {/* Rating */}
    <p className="text-gray-800 textStyle">
      <span className="font-bold">Rating:</span> {averageRating}
    </p>
  
    {/* Price */}
    <p className="text-gray-800">
      <span className="font-bold">Price:</span> {activity.price}
    </p>
  
    {/* Special Discount */}
    <p className="text-sm text-gray-600">
      <span className="font-medium text-gray-800">Special Discount:</span> {activity.specialDiscount}
    </p>
  </div>
        {role === 'admin' && 
        <div className="flex space-x-4">
          
        <div 
          onClick={flagAsInappropriate} 
          className="cursor-pointer hover:text-red-500 transition duration-300 ease-in-out"
        >
          <div className="text-blue-600 bg-gray-200 rounded-full p-2 cursor-pointer hover:bg-gray-300 transition duration-300 ease-in-out">
            <FontAwesomeIcon icon={faFlag} style={{ cursor:'pointer', color: activity.inappropriate ? 'red' : 'gray' }} />
          </div>
        </div>
      </div>
          }
            {role === 'tourist' && !transportation && (
              <div className="flex flex-col h-full justify-between mt-4">
                <div className="flex justify-between items-center mt-auto">
                  {/* Booking Button */}
                  <button 
                    onClick={() => setShowPopup(true)} 
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg py-2 px-4 hover:from-blue-600 hover:to-blue-800 transition duration-300 ease-in-out"
                  >
                    Book Activity
                  </button>
              
                  {/* Share and Email Icons */}
                  <div className="flex space-x-4">
                    {/* Share Link */}
                    <div 
                      onClick={() => {
                        const link = generateShareLink(activity._id);
                        handleCopyLink(link);
                      }} 
                      className="cursor-pointer hover:text-blue-700 transition duration-300 ease-in-out"
                    >
                      <FontAwesomeIcon icon={faShareAlt} className="text-blue-600 text-xl" />
                    </div>
                    <div 
                      onClick={toggleBookmark} 
                      className="cursor-pointer hover:text-yellow-400 transition duration-300 ease-in-out"
                    >
                      <FontAwesomeIcon
                      icon={faBookmark}
                      className="text-xl"
                      style={{ color: isBookmarked ? 'gold' : 'gray' }}
                    />
                    </div>
                    
                    {/* Email Link */}
                    <div 
                      onClick={() => {
                        const link = generateShareLink(activity._id);
                        handleShareViaEmail(link);
                      }} 
                      className="cursor-pointer hover:text-blue-700 transition duration-300 ease-in-out"
                    >
                      <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 text-xl" />
                    </div>
                  </div>
                </div>
              
                {/* Booking Popup */}
                {showPopup && (
                  <BookingPopup
                    item={activity}
                    itemType="activity"
                    onClose={() => setShowPopup(false)}
                    onBook={handleBooking}
                  />
                )}
              </div>
              )}
  
          </div>
  
          {role === 'advertiser' && (
  <div className="flex justify-between mt-2">
    <div className="flex space-x-4">
      <img
        onClick={handleEdit}
        src={assets.editIcon}
        className="w-6 h-6 cursor-pointer"
      />
      <img
        onClick={() => handleDelete(activity._id)}
        src={assets.deleteIcon}
        className="w-6 h-6 cursor-pointer"
      />
    </div>
    <button
      onClick={toggleBookingEnabled}
      className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-700"
    >
      {bookingEnabled ? 'Deactivate Booking' : 'Activate Booking'}
    </button>
  </div>
)}
        </>
      )}

    </div>
  );
};

const textStyle = {
  marginLeft : '-20px',
}

export default ActivityItem;
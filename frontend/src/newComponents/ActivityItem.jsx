// ActivityItem.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';

const ActivityItem = ({ fetchActivities, activity, role, baseUrl }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState(activity);
  const [mappedTags, setMappedTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  
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
      // console.log(categoryNames);
    })
    .catch(err => console.log(err));

    axios.get(`${baseUrl}/getPreferenceTags`, getAuthHeaders())
    .then(res => {
      const tagNames = res.data.map(tag => tag.Name);
      setTags(tagNames);
      console.log(tagNames);
    })
    .catch(err => console.log(err));
  }, []);

  const getAuthHeaders = () => {  
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
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
              className="w-full"
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
            {/* <button onClick={handleSubmit} className="bg-green-500 text-white px-2 py-1 rounded">Save</button> */}
            {/* <button onClick={handleCancel} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button> */}
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
            <p>Price Range: ${activity.price.min || '0'} - ${activity.price.max || '0'}</p>
          ) : (
            <p>Price: ${activity.price || 'Unknown price'}</p>
          )}

          <p>Category: {typeof activity.category === 'string' 
            ? activity.category 
            : activity.category?.Name || 'Unknown category'}
          </p>
          
          {Array.isArray(activity.tags) ? (
            <p>Tags: {mappedTags.join(', ')}</p>
          ) : (
            <p>Tags: No tags available</p>
          )}

          <p>Rating: {activity.rating.length === 0 ? 0 : 
              (activity.rating.reduce((acc, curr) => acc + curr, 0) / activity.rating.length).toFixed(1)
            }</p>
          <p>Special Discount: {activity.specialDiscount}</p>

          {role === 'advertiser' && (
            <div className="flex gap-2 mt-2 h-6">

              <img
                onClick={handleEdit}
                src={assets.editIcon}
                className="w-6 h-6 cursor-pointer absolute buttom-0 right-6"
              />
              {/* <button onClick={handleEdit} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button> */}
              <img
                onClick={() => handleDelete(activity._id)}
                src={assets.deleteIcon}
                className="w-6 h-6 cursor-pointer absolute buttom-0 left-6"
              />
              {/* <button onClick={() => handleDelete(activity._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button> */}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActivityItem;
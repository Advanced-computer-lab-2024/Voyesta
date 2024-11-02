// ActivityItem.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';

const ActivityItem = ({ fetchActivities, activity, role, baseUrl }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState(activity);


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

  const getAuthHeaders = () =>{
    return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }}
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedActivity(activity);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedActivity({ ...editedActivity, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const url = `${baseUrl}/updateActivity/${activity._id}`;
      // console.log(editedActivity)
      await axios.patch(url, editedActivity, getAuthHeaders());
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
        <div>
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
            type="text"
            name="location.address"
            value={editedActivity.location?.address || ''}
            onChange={handleChange}
            placeholder="Address"
          />
        </div>
        <div>
          <input
            type="text"
            name="location.city"
            value={editedActivity.location?.city || ''}
            onChange={handleChange}
            placeholder="City"
          />
        </div>
        <div>
          <input
            type="text"
            name="location.country"
            value={editedActivity.location?.country || ''}
            onChange={handleChange}
            placeholder="Country"
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
            type="number"
            name="price.min"
            value={editedActivity.price?.min || ''}
            onChange={handleChange}
            placeholder="Min Price"
          />
        </div>
        <div>
          <input
            type="number"
            name="price.max"
            value={editedActivity.price?.max || ''}
            onChange={handleChange}
            placeholder="Max Price"
          />
        </div>
        <div>
          <input
            type="text"
            name="category"
            value={editedActivity.category}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="tags"
            value={editedActivity.tags.join(', ')}
            onChange={(e) => handleChange({ target: { name: 'tags', value: e.target.value.split(', ') } })}
          />
        </div>
        <div>
          <input
            type="number"
            name="rating"
            value={editedActivity.rating}
            onChange={handleChange}
          />
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
              {activity.location.address || 'Unknown address'}, 
              {activity.location.city || 'Unknown city'}, 
              {activity.location.country || 'Unknown country'}
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
            <p>Tags: {activity.tags.join(', ')}</p>
          ) : (
            <p>Tags: No tags available</p>
          )}

          <p>Rating: {activity.rating || 'No rating available'}</p>
          
          {activity.specialDiscount && <p>Special Discount: {activity.specialDiscount}</p>}

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
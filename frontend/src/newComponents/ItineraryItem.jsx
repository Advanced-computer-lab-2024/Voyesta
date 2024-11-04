import React, { useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';

const ItineraryItem = ({ fetchItineraries, itinerary, role, baseUrl }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItinerary, setEditedItinerary] = useState(itinerary);

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedItinerary(itinerary);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItinerary({ ...editedItinerary, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const url = `${baseUrl}/updateItinerary/${itinerary._id}`;
      await axios.patch(url, editedItinerary, getAuthHeaders());
      fetchItineraries();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const url = `${baseUrl}/deleteItinerary/${id}`;
      await axios.delete(url, getAuthHeaders());
      fetchItineraries();
    } catch (error) {
      console.log(error);
    }
  };

  const convertDateToInputFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md mb-2">
      {isEditing ? (
        <>
        <div>
          <input
            type="text"
            name="name"
            value={editedItinerary.name}
            onChange={handleChange}
            className="font-bold text-lg"
          />
        </div>
        <div>
          <textarea
            name="description"
            value={editedItinerary.description}
            onChange={handleChange}
            className="w-full"
          />
        </div> 
        <div>
          <input
            type="date"
            name="startDate"
            value={convertDateToInputFormat(editedItinerary.startDate)}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="date"
            name="endDate"
            value={convertDateToInputFormat(editedItinerary.endDate)}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="locations"
            value={editedItinerary.locations.join(', ')}
            onChange={(e) => handleChange({ target: { name: 'locations', value: e.target.value.split(', ') } })}
          />
        </div>
        <div>
          <input
            type="number"
            name="tourPrice"
            value={editedItinerary.tourPrice}
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
          <h3 className="font-bold text-lg">{itinerary.name}</h3>
          <p>{itinerary.description || 'No description available'}</p>
          <p>From: {new Date(itinerary.startDate).toLocaleDateString()} To: {new Date(itinerary.endDate).toLocaleDateString()}</p>
          <p>Locations: {itinerary.locations?.join(', ')}</p>
          <p>Price: ${itinerary.tourPrice}</p>

          {role === 'tourGuide' && (
            <div className="flex gap-2 mt-2 h-6">
              <img
                onClick={handleEdit}
                src={assets.editIcon}
                className="w-6 h-6 cursor-pointer absolute buttom-0 right-6"
              />
              <img
                onClick={() => handleDelete(itinerary._id)}
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

export default ItineraryItem;
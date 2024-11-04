import React, { useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';

const MuseumAndHistoricalPlaceItem = ({ fetchPlaces, place, role, baseUrl }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlace, setEditedPlace] = useState(place);

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
    setEditedPlace(place);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPlace({ ...editedPlace, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const url = `${baseUrl}/updatePlace/${place._id}`;
      await axios.patch(url, editedPlace, getAuthHeaders());
      fetchPlaces();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const url = `${baseUrl}/deletePlace/${id}`;
      await axios.delete(url, getAuthHeaders());
      fetchPlaces();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md mb-2">
      {isEditing ? (
        <>
          <input
            type="text"
            name="name"
            value={editedPlace.name}
            onChange={handleChange}
            className="font-bold text-lg"
          />
          <textarea
            name="description"
            value={editedPlace.description}
            onChange={handleChange}
            className="w-full"
          />
          <input
            type="text"
            name="location.address"
            value={editedPlace.location?.address || ''}
            onChange={handleChange}
            placeholder="Address"
          />
          <input
            type="text"
            name="location.city"
            value={editedPlace.location?.city || ''}
            onChange={handleChange}
            placeholder="City"
          />
          <input
            type="text"
            name="location.country"
            value={editedPlace.location?.country || ''}
            onChange={handleChange}
            placeholder="Country"
          />
          <input
            type="text"
            name="openingHours"
            value={editedPlace.openingHours}
            onChange={handleChange}
          />
          <input
            type="number"
            name="ticketPrices.foreigner"
            value={editedPlace.ticketPrices?.foreigner || ''}
            onChange={handleChange}
            placeholder="Foreigner Price"
          />
          <input
            type="number"
            name="ticketPrices.native"
            value={editedPlace.ticketPrices?.native || ''}
            onChange={handleChange}
            placeholder="Native Price"
          />
          <input
            type="number"
            name="ticketPrices.student"
            value={editedPlace.ticketPrices?.student || ''}
            onChange={handleChange}
            placeholder="Student Price"
          />
          <input
            type="text"
            name="tags"
            value={editedPlace.tags.join(', ')}
            onChange={(e) => handleChange({ target: { name: 'tags', value: e.target.value.split(', ') } })}
          />
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
          <h3 className="font-bold text-lg">{place.name}</h3>
          <p>{place.description || 'No description available'}</p>
          
          {place.location && typeof place.location === 'object' ? (
            <p>Location: 
              {place.location.address || 'Unknown address'}, 
              {place.location.city || 'Unknown city'}, 
              {place.location.country || 'Unknown country'}
            </p>
          ) : (
            <p>Location information not available</p>
          )}

          <p>Opening Hours: {place.openingHours || 'Unknown hours'}</p>

          {typeof place.ticketPrices === 'object' ? (
            <>
              <p>Foreigner Price: ${place.ticketPrices.foreigner || '0'}</p>
              <p>Native Price: ${place.ticketPrices.native || '0'}</p>
              <p>Student Price: ${place.ticketPrices.student || '0'}</p>
            </>
          ) : (
            <p>Ticket Prices: Not available</p>
          )}

          {Array.isArray(place.tags) ? (
            <p>Tags: {place.tags.join(', ')}</p>
          ) : (
            <p>Tags: No tags available</p>
          )}

          {role === 'tourismGovernor' && (
            <div className="flex gap-2 mt-2 h-6">
              <img
                onClick={handleEdit}
                src={assets.editIcon}
                className="w-6 h-6 cursor-pointer absolute buttom-0 right-6"
              />
              <img
                onClick={() => handleDelete(place._id)}
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

export default MuseumAndHistoricalPlaceItem;
import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faShareAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { assets } from '../assets/assets'; // Adjust the import path as necessary

const MuseumAndHistoricalPlaceItem = ({ place, baseUrl, fetchPlaces, role, convertedPrices, targetCurrency }) => {
  const [shareLink, setShareLink] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlace, setEditedPlace] = useState(place);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPlace(place);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPlace((prevPlace) => ({
      ...prevPlace,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.patch(`${baseUrl}/updatePlace/${place._id}`, editedPlace, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchPlaces();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating place:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/deletePlace/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchPlaces();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard');
    }).catch((err) => {
      console.error('Failed to copy link: ', err);
    });
  };

  const handleShareViaEmail = (link) => {
    window.location.href = `mailto:?subject=Check this out&body=${link}`;
  };

  const generateShareLink = (placeId) => {
    const link = `${window.location.origin}/museumHistoricalPlace/${placeId}`;
    setShareLink(link);
    return link;
  };

  return (
    <div className="min-h-scre flex flex-col items-center justify-center">
      <div className="relative flex flex-col bg-white shadow-lg  pr-12 rounded-lg h-auto border border-gray-200 hover:shadow-xl transition-shadow duration-300 w-full max-w-3xl justify-center">
        {isEditing ? (
          <>
            <input
              type="text"
              name="name"
              value={editedPlace.name}
              onChange={handleChange}
              className="w-full mt-2"
            />
            <textarea
              name="description"
              value={editedPlace.description}
              onChange={handleChange}
              className="w-full mt-2"
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
                className="w-9 h-9 cursor-pointer absolute bottom-2 right-6"
              />
              <img
                onClick={handleCancel}
                src={assets.cancelIcon}
                className="w-7 h-7 cursor-pointer absolute bottom-2 left-6"
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg">{place.name}</h3>
              <p className="text-sm text-gray-500">{place.description || 'No description available'}</p>
              {place.location && typeof place.location === 'object' ? (
                <p className="text-sm text-gray-500">Location: 
                  {place.location.address || 'Unknown address'}, 
                  {place.location.city || 'Unknown city'}, 
                  {place.location.country || 'Unknown country'}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Location information not available</p>
              )}
              <p className="text-sm text-gray-500">Opening Hours: {place.openingHours || 'Unknown hours'}</p>
              {typeof place.ticketPrices === 'object' ? (
                <>
                  <p className="text-sm text-gray-500">Foreigner Price: {convertedPrices && convertedPrices.foreigner ? `${convertedPrices.foreigner.toFixed(2)} ${targetCurrency}` : `${place.ticketPrices.foreigner.toFixed(2)} USD`}</p>
                  <p className="text-sm text-gray-500">Native Price: {convertedPrices && convertedPrices.native ? `${convertedPrices.native.toFixed(2)} ${targetCurrency}` : `${place.ticketPrices.native.toFixed(2)} USD`}</p>
                  <p className="text-sm text-gray-500">Student Price: {convertedPrices && convertedPrices.student ? `${convertedPrices.student.toFixed(2)} ${targetCurrency}` : `${place.ticketPrices.student.toFixed(2)} USD`}</p>
                </>
              ) : (
                <p className="text-sm text-gray-500">Ticket Prices: Not available</p>
              )}
              {Array.isArray(place.tags) ? (
                <p className="text-sm text-gray-500">Tags: {place.tags.join(', ')}</p>
              ) : (
                <p className="text-sm text-gray-500">Tags: No tags available</p>
              )}
            </div>
            <div className="flex flex-col items-center justify-center mt-4 absolute right-4 top-1/2 transform -translate-y-1/2">
              {role === 'tourist' && (
                <>
                  <button onClick={() => {
                    const link = generateShareLink(place._id);
                    handleCopyLink(link);
                  }} className="text-blue-500 hover:text-blue-700 mb-2">
                    <FontAwesomeIcon icon={faShareAlt} className="w-5 h-5" />
                  </button>
                  <button onClick={() => {
                    const link = generateShareLink(place._id);
                    handleShareViaEmail(link);
                  }} className="text-blue-500 hover:text-blue-700 mb-2">
                    <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
                  </button>
                </>
              )}
              {role === 'tourismGovernor' && (
                <>
                  <button onClick={handleEdit} className="text-gray-600 hover:text-blue-500 mb-2">
                    <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(place._id)} className="text-gray-600 hover:text-red-500 mb-2">
                    <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MuseumAndHistoricalPlaceItem;
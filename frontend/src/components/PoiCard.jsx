import React, { useState } from 'react';
import { assets } from '../assets/assets'; // import your asset icons

function MuseumsAndHistoricalPlaceCard({ place, onEdit, userId }) {
  const [editMode, setEditMode] = useState(false);
  const [updatedPlace, setUpdatedPlace] = useState(place);

  // Check if the user is the one who created the place
  const isEditable = place.createdBy?._id === userId;

  // Edit button handler
  const handleEditClick = () => {
    setEditMode(true);
  };

  // Save changes handler
  const handleSaveClick = () => {
    onEdit(updatedPlace);
    setEditMode(false);
  };

  // Update form handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPlace({
      ...updatedPlace,
      [name]: value,
    });
  };

  return (
    <div className="bg-[#f5e1b4] shadow-md rounded-md p-4 w-80">
      {!editMode ? (
        <div>
          <img
            src={place.pictures[0]} // Assuming place.pictures is an array of image URLs
            alt={place.name}
            className="w-full h-40 object-cover"
          />
          <h2 className="text-lg font-bold">{place.name}</h2>
          <p className="text-gray-600">{place.description}</p>
          <p className="text-gray-600">Location: {place.location.address}, {place.location.city}, {place.location.country}</p>
          <p className="text-gray-600">Opening Hours: {place.openingHours}</p>
          <p className="text-gray-600">Ticket Prices: Foreigner - ${place.ticketPrices.foreigner}, Native - ${place.ticketPrices.native}, Student - ${place.ticketPrices.student}</p>
          <p className="text-gray-600">Tags: {place.tags.join(', ')}</p>

          {isEditable && (
            <div className="flex justify-end">
              <img
                onClick={handleEditClick}
                src={assets.editIcon}
                className="w-6 h-6 cursor-pointer"
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <div>
            <label className="block mb-2 font-bold">Name</label>
            <input
              type="text"
              name="name"
              value={updatedPlace.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold">Description</label>
            <textarea
              name="description"
              value={updatedPlace.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold">Location</label>
            <input
              type="text"
              name="location.address"
              value={updatedPlace.location.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="location.city"
              value={updatedPlace.location.city}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
            />
            <input
              type="text"
              name="location.country"
              value={updatedPlace.location.country}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold">Opening Hours</label>
            <input
              type="text"
              name="openingHours"
              value={updatedPlace.openingHours}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold">Ticket Prices</label>
            <input
              type="number"
              name="ticketPrices.foreigner"
              value={updatedPlace.ticketPrices.foreigner}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              name="ticketPrices.native"
              value={updatedPlace.ticketPrices.native}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
            />
            <input
              type="number"
              name="ticketPrices.student"
              value={updatedPlace.ticketPrices.student}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold">Tags</label>
            <input
              type="text"
              name="tags"
              value={updatedPlace.tags.join(', ')}
              onChange={(e) => handleChange(e.target.value.split(','))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-end mt-4">
            <img
              onClick={handleSaveClick}
              src={assets.submitIcon}
              className="w-6 h-6 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MuseumsAndHistoricalPlaceCard;

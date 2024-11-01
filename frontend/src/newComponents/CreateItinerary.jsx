import React, { useState } from 'react';
import axios from 'axios';

const CreateItinerary = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [locations, setLocations] = useState("");
  const [tourPrice, setTourPrice] = useState("");
  const [message, setMessage] = useState(null);

  const handleCreateItinerary = (e) => {
    e.preventDefault();
    const itineraryData = {
      name,
      description,
      startDate,
      endDate,
      locations: locations.split(',').map(loc => loc.trim()),
      tourPrice: parseFloat(tourPrice),
    };

    axios.post("http://localhost:3000/api/tourGuide/createItinerary", itineraryData, props.getAuthHeaders())
      .then(res => {
        console.log(res);
        setMessage("Itinerary created successfully!");
      })
      .catch(err => {
        console.log(err);
        setMessage("Error creating itinerary: " + err.message);
      });
  };

  return (
    <form onSubmit={handleCreateItinerary} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="locations" className="block text-sm font-medium text-gray-700">
          Locations (Comma-separated)
        </label>
        <input
          type="text"
          id="locations"
          value={locations}
          onChange={(e) => setLocations(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="tourPrice" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          id="tourPrice"
          value={tourPrice}
          onChange={(e) => setTourPrice(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700">
        Create Itinerary
      </button>

      {message && (
        <p className={`${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </form>
  );
};

export default CreateItinerary;
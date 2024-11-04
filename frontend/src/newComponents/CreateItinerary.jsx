import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateItinerary = () => {
  const [name, setName] = useState("");
  const [tourLanguage, setTourLanguage] = useState("");
  const [tourPrice, setTourPrice] = useState("");
  const [availableDates, setAvailableDates] = useState("");
  const [activityNames, setActivityNames] = useState([]);
  const [durations, setDurations] = useState("");
  const [accessibility, setAccessibility] = useState("");
  const [pickUpLocation, setPickUpLocation] = useState({ lat: "", lng: "" });
  const [dropOffLocation, setDropOffLocation] = useState({ lat: "", lng: "" });
  const [message, setMessage] = useState(null);
  const [activities, setActivities] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/tourGuide/getActivity", getAuthHeaders())
      .then(res => {
        setActivities(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleCreateItinerary = (e) => {
    e.preventDefault();
    const itineraryData = {
      name,
      tourLanguage,
      tourPrice: parseFloat(tourPrice),
      availableDates: availableDates.split(',').map(date => new Date(date.trim())),
      activityNames,
      durations: durations.split(',').map(duration => parseInt(duration.trim())),
      accessibility: accessibility.split(',').map(item => item.trim()),
      pickUpLocation: {
        lat: parseFloat(pickUpLocation.lat),
        lng: parseFloat(pickUpLocation.lng)
      },
      dropOffLocation: {
        lat: parseFloat(dropOffLocation.lat),
        lng: parseFloat(dropOffLocation.lng)
      }
    };

    axios.post("http://localhost:3000/api/tourGuide/createItinerary", itineraryData, getAuthHeaders())
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
        <label htmlFor="tourLanguage" className="block text-sm font-medium text-gray-700">
          Tour Language
        </label>
        <input
          type="text"
          id="tourLanguage"
          value={tourLanguage}
          onChange={(e) => setTourLanguage(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="tourPrice" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="text"
          id="tourPrice"
          value={tourPrice}
          onChange={(e) => setTourPrice(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="availableDates" className="block text-sm font-medium text-gray-700">
          Available Dates (Comma-separated, e.g., 2023-12-01, 2023-12-15)
        </label>
        <input
          type="text"
          id="availableDates"
          value={availableDates}
          onChange={(e) => setAvailableDates(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="activityNames" className="block text-sm font-medium text-gray-700">
          Activity Names
        </label>
        <select
          id="activityNames"
          multiple
          value={activityNames}
          onChange={(e) => setActivityNames(Array.from(e.target.selectedOptions, option => option.value))}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        >
          {activities.map(activity => (
            <option key={activity._id} value={activity.name}>
              {activity.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="durations" className="block text-sm font-medium text-gray-700">
          Durations (Comma-separated, in minutes)
        </label>
        <input
          type="text"
          id="durations"
          value={durations}
          onChange={(e) => setDurations(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="accessibility" className="block text-sm font-medium text-gray-700">
          Accessibility (Comma-separated)
        </label>
        <input
          type="text"
          id="accessibility"
          value={accessibility}
          onChange={(e) => setAccessibility(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div className='flex flex-col'>
        <label htmlFor="pickUpLocation" className="block text-sm font-medium text-gray-700">
          Pick-Up Location
        </label>
        <div className='flex gap-1'>
          <div className='w-1/2'>
            <label htmlFor="pickUpLocationLat" className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              type="text"
              id="pickUpLocationLat"
              value={pickUpLocation.lat}
              onChange={(e) => setPickUpLocation({ ...pickUpLocation, lat: e.target.value })}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>
          <div className='w-1/2'>
            <label htmlFor="pickUpLocationLng" className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="text"
              id="pickUpLocationLng"
              value={pickUpLocation.lng}
              onChange={(e) => setPickUpLocation({ ...pickUpLocation, lng: e.target.value })}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>
        </div>
      </div>

      <div className='flex flex-col '>
        <label htmlFor="dropOffLocation" className="w-full text-sm font-medium text-gray-700">
          Drop-Off Location
        </label>
        <div className='flex gap-1'>
          <div className='w-1/2'>
            <label htmlFor="dropOffLocationLat" className="w-full text-sm font-medium text-gray-700"> 
              Latitude
            </label>
            <input
              type="text"
              id="dropOffLocationLat"
              value={dropOffLocation.lat}
              onChange={(e) => setDropOffLocation({ ...dropOffLocation, lat: e.target.value })}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>
          <div className='w-1/2'>
            <label htmlFor="dropOffLocationLng" className="w-full text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="text"
              id="dropOffLocationLng"
              value={dropOffLocation.lng}
              onChange={(e) => setDropOffLocation({ ...dropOffLocation, lng: e.target.value })}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>
        </div>
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
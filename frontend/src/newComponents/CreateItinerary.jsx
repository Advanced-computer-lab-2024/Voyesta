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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create New Itinerary</h2>
        <form onSubmit={handleCreateItinerary} className="space-y-6 text-left">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <input
              type="text"
              name="tourLanguage"
              id="tourLanguage"
              value={tourLanguage}
              onChange={(e) => setTourLanguage(e.target.value)}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="tourLanguage"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Tour Language
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="tourPrice"
              id="tourPrice"
              value={tourPrice}
              onChange={(e) => setTourPrice(e.target.value)}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="tourPrice"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Price
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
  <input
    type="text"
    name="availableDates"
    id="availableDates"
    value={availableDates}
    onChange={(e) => setAvailableDates(e.target.value)}
    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
    placeholder=" "
    required
  />
  <label
    htmlFor="availableDates"
    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-8 scale-75 top-1 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
  >
    Available Dates (Comma-separated, e.g., 2023-12-01, 2023-12-15)
  </label>
</div>

          <div className="relative z-0 w-full mb-5 group">
            <label
              htmlFor="activityNames"
              className="block text-sm text-gray-500 mb-2"
            >
              Activity Names
            </label>
            <select
              id="activityNames"
              name="activityNames"
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

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="durations"
              id="durations"
              value={durations}
              onChange={(e) => setDurations(e.target.value)}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="durations"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Durations (Comma-separated, in minutes)
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="accessibility"
              id="accessibility"
              value={accessibility}
              onChange={(e) => setAccessibility(e.target.value)}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="accessibility"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Accessibility (Comma-separated)
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="pickUpLocationLat"
              id="pickUpLocationLat"
              value={pickUpLocation.lat}
              onChange={(e) => setPickUpLocation({ ...pickUpLocation, lat: e.target.value })}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="pickUpLocationLat"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Pick-Up Location Latitude
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="pickUpLocationLng"
              id="pickUpLocationLng"
              value={pickUpLocation.lng}
              onChange={(e) => setPickUpLocation({ ...pickUpLocation, lng: e.target.value })}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="pickUpLocationLng"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Pick-Up Location Longitude
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="dropOffLocationLat"
              id="dropOffLocationLat"
              value={dropOffLocation.lat}
              onChange={(e) => setDropOffLocation({ ...dropOffLocation, lat: e.target.value })}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="dropOffLocationLat"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Drop-Off Location Latitude
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="dropOffLocationLng"
              id="dropOffLocationLng"
              value={dropOffLocation.lng}
              onChange={(e) => setDropOffLocation({ ...dropOffLocation, lng: e.target.value })}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="dropOffLocationLng"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Drop-Off Location Longitude
            </label>
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create Itinerary
          </button>

          {message && (
            <p className={`mt-2 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateItinerary;
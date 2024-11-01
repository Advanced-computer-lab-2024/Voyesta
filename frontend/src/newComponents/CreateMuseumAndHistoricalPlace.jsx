import React, { useState } from 'react';
import axios from 'axios';

const CreateMuseumAndHistoricalPlace = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [openingHours, setOpeningHours] = useState("");
  const [foreigner, setForeigner] = useState(0);
  const [native, setNative] = useState(0);
  const [student, setStudent] = useState(0);
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState(null);

  const handleCreatePlace = (e) => {
    e.preventDefault();
    const placeData = {
      name,
      description,
      location: {
        address,
        city,
        country,
        coordinates: {
          lat,
          lng
        }
      },
      openingHours,
      ticketPrices: {
        foreigner,
        native,
        student
      },
      tags: tags.split(',').map(tag => tag.trim())
    };

    axios.post("http://localhost:3000/api/tourismGovernor/addPlace", placeData, props.getAuthHeaders())
      .then(res => {
        console.log(res);
        setMessage("Place created successfully!");
      })
      .catch(err => {
        console.log(err);
        setMessage("Error creating place: " + err.message);
      });
  };

  return (
    <form onSubmit={handleCreatePlace} className="flex flex-col gap-4">
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
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City
        </label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <input
          type="text"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="lat" className="block text-sm font-medium text-gray-700">
          Latitude
        </label>
        <input
          type="number"
          id="lat"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="lng" className="block text-sm font-medium text-gray-700">
          Longitude
        </label>
        <input
          type="number"
          id="lng"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700">
          Opening Hours
        </label>
        <input
          type="text"
          id="openingHours"
          value={openingHours}
          onChange={(e) => setOpeningHours(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="foreigner" className="block text-sm font-medium text-gray-700">
          Ticket Price for Foreigners
        </label>
        <input
          type="number"
          id="foreigner"
          value={foreigner}
          onChange={(e) => setForeigner(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="native" className="block text-sm font-medium text-gray-700">
          Ticket Price for Natives
        </label>
        <input
          type="number"
          id="native"
          value={native}
          onChange={(e) => setNative(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="student" className="block text-sm font-medium text-gray-700">
          Ticket Price for Students
        </label>
        <input
          type="number"
          id="student"
          value={student}
          onChange={(e) => setStudent(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (comma separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
      >
        Create Place
      </button>

      {message && (
        <p className={`${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </form>
  );
};

export default CreateMuseumAndHistoricalPlace;
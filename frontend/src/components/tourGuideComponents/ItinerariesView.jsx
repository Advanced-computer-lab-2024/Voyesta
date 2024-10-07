import { useState, useEffect } from 'react';
import axios from 'axios';

const Itineraries = () => {
  const [activeTab, setActiveTab] = useState("viewItineraries");
  const [itineraries, setItineraries] = useState([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activities, setActivities] = useState([]);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [locations, setLocations] = useState("");
  const [tourLanguage, setTourLanguage] = useState([]);
  const [tourPrice, setTourPrice] = useState("");
  const [avdatesandtimes, setAvDatesAndTimes] = useState([]);
  const [accessibility, setAccessibility] = useState([]);
  const [pickDropOffLocation, setPickDropOffLocation] = useState([]);
  const [message, setMessage] = useState(null);
  const [editingId, setEditingId] = useState(null); // New state for tracking which itinerary is being edited

  const baseUrl = "http://localhost:3000/api/tourGuide";
  
  const token = localStorage.getItem('token');

  const getAuthHeaders = () => {
    console.log(token);
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getItineraryByTourGuide`, getAuthHeaders());
      setItineraries(response.data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      setMessage("Error fetching itineraries.");
    }
  };

  const handleAddItinerary = async (e) => {
    e.preventDefault();
    const newItinerary = {
      name,
      startDate,
      endDate,
      activities,
      description,
      tags,
      locations: locations.split(",").map(loc => loc.trim()),
      tourLanguage,
      tourPrice,
      avdatesandtimes,
      accessibility,
      pickDropOffLocation,
    };
    console.log(token);
    console.log(editingId);

    try {
      if (editingId) {
        // Update existing itinerary
        await axios.patch(`${baseUrl}/updateItinerary/${editingId}`, newItinerary, getAuthHeaders());
        setMessage("Itinerary updated successfully.");
      } else {
        // Create new itinerary
        await axios.post(`${baseUrl}/createItinerary`, newItinerary, getAuthHeaders());
        setMessage("Itinerary added successfully.");
      }
      fetchItineraries(); // Refetch itineraries
      resetForm(); // Reset form fields
    } catch (error) {
      console.error('Error saving itinerary:', error);
      setMessage("Error saving itinerary.");
    }
  };

  const handleDeleteItinerary = async (id) => {
    try {
      await axios.delete(`${baseUrl}/deleteItinerary/${id}`, getAuthHeaders());
      setMessage("Itinerary deleted successfully.");
      fetchItineraries(); // Refetch itineraries after deletion
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      setMessage("Error deleting itinerary.");
    }
  };

  const resetForm = () => {
    setName("");
    setStartDate("");
    setEndDate("");
    setActivities([]);
    setDescription("");
    setTags([]);
    setLocations("");
    setTourLanguage([]);
    setTourPrice("");
    setAvDatesAndTimes([]);
    setAccessibility([]);
    setPickDropOffLocation([]);
    setEditingId(null); // Reset editingId
  };

  const handleEditClick = (itinerary) => {
    setName(itinerary.name);
    setStartDate(itinerary.startDate);
    setEndDate(itinerary.endDate);
    setActivities(itinerary.activities || []); // Ensure it's an array
    setDescription(itinerary.description);
    setTags(itinerary.tags || []); // Ensure it's an array
    setLocations(itinerary.locations ? itinerary.locations.join(', ') : ""); // Join if exists
    setTourLanguage(itinerary.tourLanguage || []); // Ensure it's an array
    setTourPrice(itinerary.tourPrice);
    setAvDatesAndTimes(itinerary.avdatesandtimes || []); // Ensure it's an array
    setAccessibility(itinerary.accessibility || []); // Ensure it's an array
    setPickDropOffLocation(itinerary.pickDropOffLocation || []); // Ensure it's an array
    setEditingId(itinerary._id); // Set the editing ID
    setActiveTab("addItinerary"); // Switch to the addItinerary tab
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Itinerary Management</h1>

      {/* Tab Navigation */}
      <div className="flex justify-around border-b mb-4">
        <button
          className={`p-2 ${activeTab === "viewItineraries" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("viewItineraries")}
        >
          View Itineraries
        </button>
        <button
          className={`p-2 ${activeTab === "addItinerary" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("addItinerary")}
        >
          Add Itinerary
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === "viewItineraries" && (
        <div>
          {itineraries.length > 0 ? (
            itineraries.map(itinerary => (
              <div key={itinerary._id} className="bg-gray-100 p-4 rounded shadow-md mb-2">
                <h3 className="font-bold">{itinerary.name}</h3>
                <p>{itinerary.description}</p>
                <p>From: {new Date(itinerary.startDate).toLocaleDateString()} To: {new Date(itinerary.endDate).toLocaleDateString()}</p>
                <p>Locations: {itinerary.locations.join(', ')}</p>
                <p>Price: ${itinerary.tourPrice}</p>
                {/* Edit Button */}
                <div className="flex justify-between mt-2">
                  <button
                    className="bg-yellow-500 text-white rounded-lg p-1 hover:bg-yellow-700"
                    onClick={() => handleEditClick(itinerary)}
                  >
                    Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    className="bg-red-500 text-white rounded-lg p-1 hover:bg-red-700"
                    onClick={() => handleDeleteItinerary(itinerary._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No itineraries found.</p>
          )}
        </div>
      )}

      {activeTab === "addItinerary" && (
        <form onSubmit={handleAddItinerary} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
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
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
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
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
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
            <label htmlFor="activities" className="block text-sm font-medium text-gray-700">Activities (Comma-separated IDs)</label>
            <input
              type="text"
              id="activities"
              value={activities.join(',')}
              onChange={(e) => setActivities(e.target.value.split(",").map(id => id.trim()))}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              rows="4"
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (Comma-separated)</label>
            <input
              type="text"
              id="tags"
              value={tags.join(',')}
              onChange={(e) => setTags(e.target.value.split(",").map(tag => tag.trim()))}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="locations" className="block text-sm font-medium text-gray-700">Locations (Comma-separated)</label>
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
            <label htmlFor="tourPrice" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="tourPrice"
              value={tourPrice}
              onChange={(e) => setTourPrice(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
            {editingId ? 'Update Itinerary' : 'Add Itinerary'}
          </button>
        </form>
      )}

      {message && <div className="mt-4 text-red-500">{message}</div>}
    </div>
  );
};

export default Itineraries;

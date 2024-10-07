import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For API requests
import MuseumsAndHistoricalPlaceCard from './PoiCard'; // Import the card component

function EditPlacesOfInterest({ userId }) {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null); // To keep track of the place being edited
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Fetch places on mount
  useEffect(() => {
    fetchPlaces();
  }, []);

  const token = localStorage.getItem('token');

  const getAuthHeaders = () =>{
    console.log(token);
    return {
    headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDMzMzYwNDEzNDUxYzc5YmI0NGU4ZCIsInR5cGUiOiJ0b3VyaXNtR292ZXJuZXIiLCJpYXQiOjE3MjgyNjMwMDgsImV4cCI6MTc1NDE4MzAwOH0.qdjnre9S9j4zFhuscE0dnFxTD8KZLX2_r_pg_gXI1UE`
    }}
};

  // Function to fetch all places
  const fetchPlaces = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tourismGoverner/get', getAuthHeaders()); // Make sure to replace the endpoint with your actual API
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  // Function to delete a place
  const handleDelete = async (placeId) => {
    try {
      await axios.delete(`http://localhost:3000/api/tourismGoverner/delete/${placeId}`,getAuthHeaders());
      // Refresh the list of places
      setPlaces(places.filter((place) => place._id !== placeId));
    } catch (error) {
      console.error('Error deleting place:', error);
    }
  };

  // Function to update a place
// Function to update a place
const handleUpdate = async () => {
  try {
    // Create a new object with only the relevant properties to send to the server
    const placeData = {
      name: selectedPlace.name,
      description: selectedPlace.description,
      tags: selectedPlace.tags,
      // Add any other fields that should be updated here
    };

    await axios.patch(
      `http://localhost:3000/api/tourismGoverner/update/${selectedPlace._id}`,
      placeData, // Only send the relevant data
      getAuthHeaders()
    );

    // Update the state after editing
    const updatedPlaces = places.map((place) =>
      place._id === selectedPlace._id ? { ...place, ...placeData } : place
    );
    setPlaces(updatedPlaces);
    setIsEditing(false);
  } catch (error) {
    console.error('Error updating place:', error);
  }
};


  // Function to update tags
  const handleUpdateTags = async (placeId, newTags) => {
    try {
      // Use POST or PUT to add new tags to the place
      await axios.put(`http://localhost:3000/api/tourismGoverner/addTag`,getAuthHearders() , { tags: newTags });

      // Update the tags locally after successful update
      const updatedPlaces = places.map((place) =>
        place._id === placeId ? { ...place, tags: [...place.tags, ...newTags] } : place
      );
      setPlaces(updatedPlaces);
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  // Render form to update tags
  const renderTagsUpdateForm = (place) => {
    const [newTags, setNewTags] = useState(place.tags.join(', ')); // Join tags with commas for the input

    const handleSaveTags = () => {
      const tagsArray = newTags.split(',').map((tag) => tag.trim()); // Split by comma and trim whitespace
      handleUpdateTags(place._id, tagsArray);
    };

    return (
      <div className="bg-white shadow-md rounded-md p-4 w-80">
        <h3 className="font-bold">Update Tags for {place.name}</h3>
        <input
          type="text"
          value={newTags}
          onChange={(e) => setNewTags(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        />
        <button onClick={handleSaveTags} className="mt-2 bg-blue-500 text-white p-2 rounded">
          Save Tags
        </button>
      </div>
    );
  };

  // Filter places based on the search query
  const filteredPlaces = places.filter((place) =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by name
    place.description.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by description
    place.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) // Search by tags
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Museums and Historical Places</h1>
      
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, description or tags"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          className="border p-2 rounded-md w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredPlaces.map((place) => (
          <div key={place._id} className="place-card">
            <MuseumsAndHistoricalPlaceCard
              place={place}
              userId={userId}
              onEdit={(updatedPlace) => {
                setSelectedPlace(updatedPlace);
                setIsEditing(true);
              }}
            />

            {/* Show delete button */}
            <button
              onClick={() => handleDelete(place._id)}
              className="mt-2 bg-red-500 text-white p-2 rounded"
            >
              Delete
            </button>

            {/* Show form to update tags */}
            {/* {renderTagsUpdateForm(place)} */}

            {/* If the user clicked "edit", show the edit form */}
            {isEditing && selectedPlace?._id === place._id && (
              <div>
                <MuseumsAndHistoricalPlaceCard
                  place={selectedPlace}
                  userId={userId}
                />
                <button
                  onClick={handleUpdate}
                  className="mt-2 bg-green-500 text-white p-2 rounded"
                >
                  Update
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditPlacesOfInterest;

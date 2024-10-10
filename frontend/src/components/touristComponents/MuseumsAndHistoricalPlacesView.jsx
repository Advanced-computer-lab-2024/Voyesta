import { useState, useEffect } from 'react';
import axios from 'axios';

const MuseumsView = () => {
  const [museums, setMuseums] = useState([]);
  const [message, setMessage] = useState(null);
  const baseUrl = "http://localhost:3000/api/tourist"; // Adjust as needed

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getMuseumsHistoricalPlaces`);
        setMuseums(response.data);
      } catch (error) {
        console.error('Error fetching museums:', error);
        setMessage('Error fetching museums.');
      }
    };

    fetchMuseums();
  }, []);

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Museums and Historical Places</h1>

      {message && <div className="text-red-500 mb-4">{message}</div>}

      {museums.length > 0 ? (
        museums.map((museum) => (
          <div key={museum._id} className="bg-gray-100 p-4 rounded shadow-md mb-2">
            <h2 className="font-bold text-lg">{museum.name}</h2>
            <p>{museum.description}</p>

            {/* Handling location if it's an object */}
            {museum.location && (
              <p>Location: {museum.location.address}, {museum.location.city}, {museum.location.country}</p>
            )}

            {/* Displaying additional fields, such as opening hours, price, and tags */}
            {museum.openingHours && <p>Opening Hours: {museum.openingHours}</p>}

            {typeof museum.price === 'object' ? (
              <p>Price Range: ${museum.price.min} - ${museum.price.max}</p>
            ) : (
              <p>Price: ${museum.price}</p>
            )}

            {museum.tags && <p>Tags: {museum.tags.join(', ')}</p>}
          </div>
        ))
      ) : (
        <p>No museums found.</p>
      )}
    </div>
  );
};

export default MuseumsView;

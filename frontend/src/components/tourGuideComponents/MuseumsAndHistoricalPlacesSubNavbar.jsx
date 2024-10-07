import { useState, useEffect } from 'react';
import axios from 'axios';

const MuseumsView = () => {
  const [museums, setMuseums] = useState([]);
  const [message, setMessage] = useState(null);
  const baseUrl = "http://localhost:3000/api/tourGuide"; // Adjust as needed

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getMuseumsAndHistoricalPlaces`);
        setMuseums(response.data);
      } catch (error) {
        console.error('Error fetching museums:', error);
        setMessage('Error fetching museums.');
      }
    };

    fetchMuseums();
  }, []);

  return (
    <div>
      <h1>Museums and Historical Places</h1>
      {museums.length > 0 ? (
        museums.map(museum => (
          <div key={museum._id}>
            <h2>{museum.name}</h2>
            {/* Add any additional museum info and functionality for updates */}
          </div>
        ))
      ) : (
        <p>No museums found.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default MuseumsView;

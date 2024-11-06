import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ItineraryItem from './ItineraryItem';

const ItineraryDetail = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/itinerary/getById/${id}`);
        setItinerary(response.data);
      } catch (error) {
        setMessage('Failed to fetch itinerary details');
      }
    };

    fetchItinerary();
  }, [id]);

  if (message) {
    return <div>{message}</div>;
  }

  if (!itinerary) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-4/5 mx-auto my-auto mt-32'>
      <ItineraryItem itinerary={itinerary} />
    </div>
  );
};

export default ItineraryDetail;
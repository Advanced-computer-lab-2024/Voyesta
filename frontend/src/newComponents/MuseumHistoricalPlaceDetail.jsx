import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MuseumAndHistoricalPlaceItem from './MuseumAndHistoricalPlaceItem';

const MuseumHistoricalPlaceDetail = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/museumsHistoricalPlaces/getById/${id}`);
        setPlace(response.data);
      } catch (error) {
        setMessage('Failed to fetch place details');
      }
    };

    fetchPlace();
  }, [id]);

  if (message) {
    return <div>{message}</div>;
  }

  if (!place) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-4/5 mx-auto my-auto mt-32'>
      <MuseumAndHistoricalPlaceItem place={place} />
    </div>
  );
};

export default MuseumHistoricalPlaceDetail;
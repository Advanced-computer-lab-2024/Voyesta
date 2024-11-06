import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
    <div>
      <h1>{place.name}</h1>
      <p>{place.description}</p>
      <div>
        <h3>Pictures:</h3>
        {place.pictures.map((picture, index) => (
          <img key={index} src={picture} alt={`Picture ${index + 1}`} />
        ))}
      </div>
      <p>Location: {place.location.address}, {place.location.city}, {place.location.country}</p>
      <p>Coordinates: {place.location.coordinates.lat}, {place.location.coordinates.lng}</p>
      <p>Opening Hours: {place.openingHours}</p>
      <p>Ticket Prices: Foreigner - {place.ticketPrices.foreigner}, Native - {place.ticketPrices.native}, Student - {place.ticketPrices.student}</p>
      {console.log(place.tags)}
      <p>Tags: {place.tags.map(tag => tag).join(', ')}</p>
      <p>Created By: {place.createdBy.username}</p>
    </div>
  );
};

export default MuseumHistoricalPlaceDetail;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ItineraryDetail = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/itineraries/getById/${id}`);
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
    <div>
      <h1>{itinerary.name}</h1>
      <p>Available Dates: {itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(', ')}</p>
      <p>Activities: {itinerary.activities.map(activity => activity.name).join(', ')}</p>
      <p>Tags: {itinerary.tags.map(tag => tag.Name).join(', ')}</p>
      <p>Locations: {itinerary.locations.map(loc => `(${loc.lat}, ${loc.lng})`).join(', ')}</p>
      <p>Timeline: {itinerary.timeline.join(', ')}</p>
      <p>Durations: {itinerary.durations.join(', ')}</p>
      <p>Tour Language: {itinerary.tourLanguage}</p>
      <p>Tour Price: ${itinerary.tourPrice}</p>
      <p>Accessibility: {itinerary.accessibility.join(', ')}</p>
      <p>Pick-Up Location: ({itinerary.pickUpLocation.lat}, {itinerary.pickUpLocation.lng})</p>
      <p>Drop-Off Location: ({itinerary.dropOffLocation.lat}, {itinerary.dropOffLocation.lng})</p>
      <p>Ratings: {itinerary.ratings.map(rating => `${rating.tourist.username}: ${rating.rating}`).join(', ')}</p>
      <p>Comments: {itinerary.comments.map(comment => `${comment.tourist.username}: ${comment.comment}`).join(', ')}</p>
    </div>
  );
};

export default ItineraryDetail;
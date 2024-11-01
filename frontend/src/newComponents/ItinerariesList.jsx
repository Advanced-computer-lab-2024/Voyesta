import React from 'react';
import ItineraryItem from './ItineraryItem';

const ItinerariesList = ({ fetchItineraries, itineraries, role, baseUrl }) => {
  return (
    <div className='flex flex-col gap-1'>
      {itineraries.length > 0 ? (
        itineraries.map((itinerary) => (
          <ItineraryItem key={itinerary._id} fetchItineraries={fetchItineraries} baseUrl={baseUrl} itinerary={itinerary} role={role} />
        ))
      ) : (
        <p>No itineraries found.</p>
      )}
    </div>
  );
};

export default ItinerariesList;
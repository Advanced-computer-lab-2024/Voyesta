import React from 'react';
import MuseumAndHistoricalPlaceItem from './MuseumAndHistoricalPlaceItem';

const MuseumsAndHistoricalPlacesList = ({ fetchPlaces, places, role, baseUrl }) => {
  return (
    <div className='flex flex-col gap-1'>
      {places.length > 0 ? (
        places.map((place) => (
          <MuseumAndHistoricalPlaceItem key={place._id} fetchPlaces={fetchPlaces} baseUrl={baseUrl} place={place} role={role} />
        ))
      ) : (
        <p>No places found.</p>
      )}
    </div>
  );
};

export default MuseumsAndHistoricalPlacesList;
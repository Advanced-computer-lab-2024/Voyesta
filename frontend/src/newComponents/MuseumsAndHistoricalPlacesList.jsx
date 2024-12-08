import React from 'react';
import MuseumAndHistoricalPlaceItem from './MuseumAndHistoricalPlaceItem';

const MuseumsAndHistoricalPlacesList = ({ fetchPlaces, places, role, baseUrl, convertedPrices, targetCurrency,setSuccessMessage }) => {
  return (
    <div className='flex flex-col gap-1'>
      {places.length > 0 ? (
        places.map((place, index) => (
          <MuseumAndHistoricalPlaceItem
            key={place._id}
            fetchPlaces={fetchPlaces}
            baseUrl={baseUrl}
            place={place}
            role={role}
            convertedPrices={convertedPrices[index]} // Pass convertedPrices
            targetCurrency={targetCurrency} // Pass targetCurrency
            setSuccessMessage = {setSuccessMessage}
          />
        ))
      ) : (
        <p>No places found.</p>
      )}
    </div>
  );
};

export default MuseumsAndHistoricalPlacesList;
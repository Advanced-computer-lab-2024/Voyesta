import React from 'react';
import ItineraryItem from './ItineraryItem';

const ItinerariesList = ({ fetchItineraries, itineraries, role, baseUrl, convertedPrices, targetCurrency,setSuccessMessage  }) => {
  return (
    <div className='flex flex-col gap-1'>
      {itineraries.length > 0 ? (
        itineraries.map((itinerary, index) => (
          <ItineraryItem
            key={itinerary._id}
            fetchItineraries={fetchItineraries}
            baseUrl={baseUrl}
            itinerary={itinerary}
            role={role}
            convertedPrice={convertedPrices[index]} // Pass convertedPrice
            targetCurrency={targetCurrency} // Pass targetCurrency
            setSuccessMessage = {setSuccessMessage}
          />
        ))
      ) : (
        <p>No itineraries found.</p>
      )}
    </div>
  );
};

export default ItinerariesList;
import React from 'react';
import moment from 'moment'; // Using Moment.js for date formatting
import '../css/flightCard.css';

const FlightCard = ({ flight, onConfirm }) => {
    const { price, itineraries } = flight;
    
    // Check if it's a direct flight or connecting
    const flightType = itineraries.length > 2 ? 'Connecting' : 'Direct';

    return (
        <div className="flight-card">
            {/* Flight Price */}
            <p><strong>Price:</strong> {price.currency} {parseFloat(price.grandTotal).toFixed(2)}</p>

            {/* Flight Type */}
            <p><strong>Flight Type:</strong> {flightType}</p>

            {/* Itinerary Details */}
            {itineraries.map((itinerary, index) => (
                <div key={index}>
                    <ul>
                        {itinerary.segments.map((segment, segmentIndex) => (
                            <li key={segmentIndex} className="flight-segment">
                                {/* Departure Information */}
                                <div>
                                    <strong>Departure:</strong> 
                                    {segment.departure.iataCode} at {moment(segment.departure.at).format('MMM Do YYYY, h:mm A')}
                                </div>
                                
                                {/* Arrival Information */}
                                <div>
                                    <strong>Arrival:</strong> 
                                    {segment.arrival.iataCode} at {moment(segment.arrival.at).format('MMM Do YYYY, h:mm A')}
                                </div>

                                {/* Flight Number */}
                                <div>
                                    <strong>Flight Number:</strong> {segment.carrierCode} {segment.number}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            
            {/* Confirm Button */}
            <button onClick={() => onConfirm(flight.id)}>Confirm Price</button>
        </div>
    );
};

export default FlightCard;

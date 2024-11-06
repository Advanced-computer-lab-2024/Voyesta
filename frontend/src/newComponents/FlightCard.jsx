import React from 'react';

const FlightCard = ({ flight, onConfirm }) => {
    return (
        <div className="flight-card">
            <h3>Flight from {flight.origin} to {flight.destination}</h3>
            <p>Departure: {flight.departureDate}</p>
            <p>Return: {flight.returnDate}</p>
            <p>Price: {flight.price}</p>
            <button onClick={() => onConfirm(flight.id)}>Confirm Price</button>
        </div>
    );
};

export default FlightCard;
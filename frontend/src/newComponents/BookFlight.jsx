import React, { useState } from 'react';
import axios from 'axios';
import FlightCard from './FlightCard';

const BookFlight = ({ baseUrl }) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [adults, setAdults] = useState(1);
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      };


    const searchFlights = async () => {
        setLoading(true);
        setError('');
        const url = `${baseUrl}/searchFlights?origin=${origin}&destination=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&adults=${adults}`;
        
        // Log the URL to confirm it contains the query parameters
        
        try {
            const response = await axios.get(url, getAuthHeaders());
            setFlights(response.data);
        } catch (err) {
            setError('Failed to search for flights.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const confirmFlightPrice = async (flightId) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(
                `${baseUrl}/confirmFlightPrice`, 
                { flightId },
                getAuthHeaders()  // Add headers here
            );
            setSelectedFlight(response.data);
        } catch (err) {
            setError('Failed to confirm flight price.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div>
            <h1>Book Flight</h1>
            <div>
                <label>Origin:</label>
                <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} />
            </div>
            <div>
                <label>Destination:</label>
                <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
            </div>
            <div>
                <label>Departure Date:</label>
                <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
            </div>
            <div>
                <label>Return Date:</label>
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
            </div>
            <div>
                <label>Adults:</label>
                <input type="number" value={adults} onChange={(e) => setAdults(e.target.value)} min="1" />
            </div>
            <button onClick={searchFlights} disabled={loading}>Search Flights</button>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <div>
                {flights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} onConfirm={confirmFlightPrice} />
                ))}
            </div>
            {selectedFlight && (
                <div>
                    <h2>Selected Flight</h2>
                    <p>Price: {selectedFlight.price}</p>
                </div>
            )}
        </div>
    );
};

export default BookFlight;
import React, { useState } from 'react';
import axios from 'axios';
import FlightCard from './FlightCard';
import { CircularProgress, TextField, Button, Typography, Snackbar } from '@mui/material';

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
    const [successMessage, setSuccessMessage] = useState('');

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

        const selectedFlightOffer = flights.find(flight => flight.id === flightId);

        if (!selectedFlightOffer) {
            setError('Selected flight not found.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${baseUrl}/confirmFlightPrice`, 
                { flightOffer: selectedFlightOffer },
                getAuthHeaders() 
            );
            setSelectedFlight(response.data);
            setSuccessMessage('Flight price confirmed successfully!');
        } catch (err) {
            setError('Failed to confirm flight price.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>Book Flight</Typography>

            <div style={{ marginBottom: '20px' }}>
                <TextField label="Origin" variant="outlined" fullWidth value={origin} onChange={(e) => setOrigin(e.target.value)} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <TextField label="Destination" variant="outlined" fullWidth value={destination} onChange={(e) => setDestination(e.target.value)} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <TextField type="date" label="Departure Date" variant="outlined" fullWidth value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <TextField type="date" label="Return Date" variant="outlined" fullWidth value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <TextField type="number" label="Adults" variant="outlined" fullWidth value={adults} onChange={(e) => setAdults(e.target.value)} min="1" />
            </div>
            <Button onClick={searchFlights} variant="contained" color="primary" disabled={loading} fullWidth>
                {loading ? <CircularProgress size={24} /> : 'Search Flights'}
            </Button>

            {error && <Snackbar open={true} message={error} autoHideDuration={6000} />}
            {successMessage && <Snackbar open={true} message={successMessage} autoHideDuration={6000} />}

            <div style={{ marginTop: '20px' }}>
                {flights.length > 0 && flights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} onConfirm={confirmFlightPrice} />
                ))}
            </div>

            {selectedFlight && (
                <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <Typography variant="h6">Selected Flight</Typography>
                    <Typography variant="body1">
                        Price: {selectedFlight.price.grandTotal} {selectedFlight.price.currency}
                    </Typography>
                    <Button variant="contained" color="secondary" style={{ marginTop: '10px' }}>
                        Proceed with Booking
                    </Button>
                </div>
            )}
        </div>
    );
};

export default BookFlight;

import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress, TextField, Button, Typography, Snackbar } from '@mui/material';
import FlightCard from "../newComponents/FlightCard";
import {
    Container,
    TextField,
    Button,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    CircularProgress,
    Alert,
    Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BookFlight = ({ baseUrl }) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [adults, setAdults] = useState(1);
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const navigate = useNavigate();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const searchFlights = async () => {
        setLoading(true);
        setError('');
        setFlights([]);
        setHasSearched(false);

        const url = `${baseUrl}/searchFlights?origin=${origin}&destination=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&adults=${adults}`;
        try {
            const response = await axios.get(url, getAuthHeaders());
            setFlights(response.data);
            console.log(response.data);
        } catch (err) {
            setError('Failed to fetch flights. Please check your input or try again.');
            console.error(err);
        } finally {
            setLoading(false);
            setHasSearched(true);
        }
    };

    const handleBookFlight = (flight) => {
        navigate('/tourist/flight-booking-confirmation', { state: { flight } });
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Search Flights
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <TextField
                    label="Origin"
                    variant="outlined"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Destination"
                    variant="outlined"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Departure Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Return Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Adults"
                    type="number"
                    variant="outlined"
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    inputProps={{ min: 1 }}
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={searchFlights}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Search Flights'}
                </Button>
            </Box>

            <div style={{ marginBottom: '20px' }}>
                <TextField label="Origin" variant="outlined" fullWidth value={origin} onChange={(e) => setOrigin(e.target.value)} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <TextField label="Destination" variant="outlined" fullWidth value={destination} onChange={(e) => setDestination(e.target.value)} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <TextField
                    label="Departure Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    fullWidth
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <TextField
                    label="Return Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    fullWidth
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <TextField
                    label="Adults"
                    type="number"
                    variant="outlined"
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    inputProps={{ min: 1 }}
                    fullWidth
                />
            </div>
            <Button onClick={searchFlights} variant="contained" color="primary" disabled={loading} fullWidth>
                {loading ? <CircularProgress size={24} /> : 'Search Flights'}
            </Button>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Grid container spacing={3}>
                {flights.map((flight) => (
                    <Grid item xs={12} sm={6} md={4} key={flight.id}>
                        <Card>
                            <CardContent>
                                
                                <Typography variant="h6">Flight: {flight.itineraries[0].segments[0].aircraft.code}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Departure: {flight.itineraries[0].segments[0].departure.iataCode}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                {console.log("Zeiad Log: ", flight.itineraries[0].segments.length, flight.itineraries[0].segments)}
                                    Arrival: {(flight.itineraries[0].segments.length > 1) ? flight.itineraries[0].segments[1].arrival.iataCode : flight.itineraries[0].segments[0].arrival.iataCode}
                                </Typography>
                                <Typography variant="body1">
                                    Price: {flight.price.total} {flight.price.currency}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    onClick={() => handleBookFlight(flight)}
                                >
                                    Book Flight
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {hasSearched && !loading && flights.length === 0 && !error && (
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 3 }}>
                    No flights found. Try a different search.
                </Typography>
            )}
        </Container>
    );
};

export default BookFlight;
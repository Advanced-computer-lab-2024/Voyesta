import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

const FlightBookingConfirmation = () => {
    const location = useLocation();
    const { flight } = location.state || {};

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Booking Confirmed!
            </Typography>
            {flight ? (
                <Box>
                    <Typography variant="h6">Flight: {flight.itineraries[0].segments[0].aircraft.code}</Typography>
                    <Typography variant="body1">Departure: {flight.itineraries[0].segments[0].departure.iataCode}</Typography>
                    <Typography variant="body1">Arrival: {(flight.itineraries[0].segments.length > 1) ? flight.itineraries[0].segments[1].arrival.iataCode : flight.itineraries[0].segments[0].arrival.iataCode}</Typography>
                    <Typography variant="body1">Thank you for booking with us!</Typography>
                </Box>
            ) : (
                <Typography variant="body1" color="error">
                    No flight details available. Please try again.
                </Typography>
            )}
        </Container>
    );
};

export default FlightBookingConfirmation;
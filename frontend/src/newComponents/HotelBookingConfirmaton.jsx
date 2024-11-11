import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

const HotelBookingConfirmation = () => {
    const location = useLocation();
    const { hotel } = location.state || {};

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Booking Confirmed!
            </Typography>
            {hotel ? (
                <Box>
                    <Typography variant="h6">Hotel: {hotel.hotel.name}</Typography>
                    <Typography variant="body1">Location: Latitude {hotel.hotel.latitude}, Longitude {hotel.hotel.longitude}</Typography>
                    <Typography variant="body1">Thank you for booking with us!</Typography>
                </Box>
            ) : (
                <Typography variant="body1" color="error">
                    No hotel details available. Please try again.
                </Typography>
            )}
        </Container>
    );
};

export default HotelBookingConfirmation;

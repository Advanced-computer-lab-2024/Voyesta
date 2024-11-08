import React, { useState } from 'react';
import axios from 'axios';
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

const BookHotel = ({ baseUrl }) => {
    const [cityCode, setCityCode] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [adults, setAdults] = useState(1);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const navigate = useNavigate(); // Initialize navigation hook

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const searchHotels = async () => {
        setLoading(true);
        setError('');
        setHotels([]);
        setHasSearched(false);

        const url = `${baseUrl}/searchHotels?cityCode=${cityCode}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}`;
        try {
            const response = await axios.get(url, getAuthHeaders());
            setHotels(response.data);
        } catch (err) {
            setError('Failed to fetch hotels. Please check your input or try again.');
            console.error(err);
        } finally {
            setLoading(false);
            setHasSearched(true);
        }
    };

    const handleBookHotel = (hotel) => {
        // Redirect to the confirmation page with hotel details
        navigate('/hotel-booking-confirmation', { state: { hotel } });
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Search Hotels
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <TextField
                    label="City Code"
                    variant="outlined"
                    value={cityCode}
                    onChange={(e) => setCityCode(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Check-In Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Check-Out Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
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
                    onClick={searchHotels}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Search Hotels'}
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Grid container spacing={3}>
                {hotels.map((hotel) => (
                    <Grid item xs={12} sm={6} md={4} key={hotel.hotel.hotelId}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{hotel.hotel.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Latitude: {hotel.hotel.latitude}, Longitude: {hotel.hotel.longitude}
                                </Typography>
                                <Typography variant="body1">
                                    Available: {hotel.available ? 'Yes' : 'No'}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                                    Offers:
                                </Typography>
                                {hotel.offers?.map((offer) => (
                                    <Box key={offer.id} sx={{ ml: 2 }}>
                                        <Typography variant="body2">Room: {offer.room.description.text}</Typography>
                                        <Typography variant="body2">
                                            Price: {offer.price.total} {offer.price.currency}
                                        </Typography>
                                    </Box>
                                ))}
                            </CardContent>
                            <CardActions>
                                {hotel.available && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        fullWidth
                                        onClick={() => handleBookHotel(hotel)}
                                    >
                                        Book Hotel
                                    </Button>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {hasSearched && !loading && hotels.length === 0 && !error && (
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 3 }}>
                    No hotels found. Try a different search.
                </Typography>
            )}
        </Container>
    );
};

export default BookHotel;

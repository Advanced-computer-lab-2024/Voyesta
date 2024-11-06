import React, { useState } from 'react';
import axios from 'axios';

const BookHotel = ({ baseUrl }) => {
    const [cityCode, setCityCode] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [adults, setAdults] = useState(1);
    const [hotels, setHotels] = useState([]);
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

    const searchHotels = async () => {
        setLoading(true);
        setError('');
        const url = `${baseUrl}/searchHotels?cityCode=${cityCode}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}`;
        
        try {
            const response = await axios.get(url, getAuthHeaders());
            setHotels(response.data);
        } catch (err) {
            setError('Failed to search for hotels.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Book Hotel</h1>
            <div>
                <label>City Code:</label>
                <input type="text" value={cityCode} onChange={(e) => setCityCode(e.target.value)} />
            </div>
            <div>
                <label>Check-In Date:</label>
                <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
            </div>
            <div>
                <label>Check-Out Date:</label>
                <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
            </div>
            <div>
                <label>Adults:</label>
                <input type="number" value={adults} onChange={(e) => setAdults(e.target.value)} min="1" />
            </div>
            <button onClick={searchHotels} disabled={loading}>Search Hotels</button>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            <div>
                {hotels.length > 0 && hotels.map((hotel) => (
                    <div key={hotel.id} style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
                        <h2>{hotel.hotel.name}</h2>
                        <p>Address: {hotel.hotel.address.lines.join(', ')}</p>
                        <p>Rating: {hotel.hotel.rating}</p>
                        {hotel.offers?.map((offer, index) => (
                            <div key={index}>
                                <p>Room Type: {offer.room.description.text}</p>
                                <p>Price: {offer.price.total} {offer.price.currency}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookHotel;

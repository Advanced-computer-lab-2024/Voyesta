// frontend/src/pages/BookingsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingsPage = ({ baseUrl }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getBookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      const response = await axios.patch(`${baseUrl}/payForBooking/${bookingId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert(response.data.message);
      fetchBookings(); // Refresh bookings after payment
    } catch (error) {
      console.error('Error processing payment:', error);
      alert(error.response.data.error);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await axios.patch(`${baseUrl}/cancelBooking/${bookingId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Booking cancelled successfully!');
      fetchBookings(); // Refresh bookings after cancellation
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(error.response.data.error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="bg-gray-100 p-4 rounded shadow-md mb-2">
            <p>Booking ID: {booking._id}</p>
            <p>Event Date: {new Date(booking.eventDate).toLocaleDateString()}</p>
            <p>Status: {booking.status}</p>
            <button onClick={() => handlePayment(booking._id)} className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700">
              Pay Now
            </button>
            <button onClick={() => handleCancel(booking._id)} className="bg-red-500 text-white rounded-lg p-2 mt-4 hover:bg-red-700">
              Cancel Booking
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default BookingsPage;
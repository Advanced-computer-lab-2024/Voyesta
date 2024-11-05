// frontend/src/pages/BookingsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../newComponents/EventCard';

const BookingsPage = ({ baseUrl }) => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');

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

  const upcomingBookings = bookings.filter(booking => new Date(booking.eventDate) >= new Date());
  const attendedBookings = bookings.filter(booking => new Date(booking.eventDate) < new Date());

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">My Bookings</h1>
      <div className="flex mb-4">
        <button
          className={`p-2 ${activeTab === 'upcoming' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events
        </button>
        <button
          className={`p-2 ${activeTab === 'attended' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('attended')}
        >
          Attended Events
        </button>
      </div>
      {activeTab === 'upcoming' ? (
        <div>
          {upcomingBookings.length === 0 ? (
            <p>No upcoming bookings found.</p>
          ) : (
            upcomingBookings.map((booking) => (
              <EventCard
                key={booking._id}
                booking={booking}
                baseUrl={baseUrl}
                handlePayment={handlePayment}
                handleCancel={handleCancel}
              />
            ))
          )}
        </div>
      ) : (
        <div>
          {attendedBookings.length === 0 ? (
            <p>No attended bookings found.</p>
          ) : (
            attendedBookings.map((booking) => (
              <EventCard
                key={booking._id}
                booking={booking}
                baseUrl={baseUrl}
                handlePayment={handlePayment}
                handleCancel={handleCancel}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
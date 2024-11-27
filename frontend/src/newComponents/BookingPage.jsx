import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../newComponents/EventCard';

const BookingsPage = ({ baseUrl }) => {
  const [bookings, setBookings] = useState([]);
  const [PaidEvents, setUpcomingPaidEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchBookings();
    if (activeTab === 'upcoming-paid') {
      fetchUpcomingPaidEvents();
    }
  }, [activeTab]);

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

  const fetchUpcomingPaidEvents = async () => {
    try {
      const response = await axios.get(`${baseUrl}/viewallpaidupcomingbookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUpcomingPaidEvents(response.data);
    } catch (error) {
      console.error('Error fetching upcoming paid events:', error);
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
  const upcomingPaidEvents = PaidEvents.filter(event => new Date(event.eventDate) >= new Date());
  const recentPaidEvents = PaidEvents.filter(event => new Date(event.eventDate) < new Date());

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
        <button
          className={`p-2 ${activeTab === 'upcoming-paid' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('upcoming-paid')}
        >
          Upcoming Paid Events
        </button>
        <button
          className={`p-2 ${activeTab === 'recent-paid' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('recent-paid')}
        >
          Recent Paid Events
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
      ) : activeTab === 'attended' ? (
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
      ) : activeTab === 'upcoming-paid' ? (
        <div>
          {upcomingPaidEvents.length === 0 ? (
            <p>No upcoming paid events found.</p>
          ) : (
            upcomingPaidEvents.map((event) => (
              <EventCard
                key={event._id}
                booking={event}
                baseUrl={baseUrl}
                handlePayment={handlePayment}
                handleCancel={handleCancel}
              />
            ))
          )}
        </div>
      ) : activeTab === 'recent-paid' ? (
        <div>
          {recentPaidEvents.length === 0 ? (
            <p>No recent paid events found.</p>
          ) : (
            recentPaidEvents.map((event) => (
              <EventCard
                key={event._id}
                booking={event}
                baseUrl={baseUrl}
                handlePayment={handlePayment}
                handleCancel={handleCancel}
              />
            ))
          )}
        </div>
      ) : null}
    </div>
  );
};

export default BookingsPage;

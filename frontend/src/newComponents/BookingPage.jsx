import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EventCard from '../newComponents/EventCard';

const BookingsPage = ({ baseUrl }) => {
  const [bookings, setBookings] = useState([]);
  const [PaidEvents, setUpcomingPaidEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'upcoming') {
      fetchBookings();
    } else if (activeTab === 'upcoming-paid') {
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
      const response = await axios.get(`${baseUrl}/viewAllPaidBookings`, {
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
    console.log('Payment for booking:', bookingId);
    const booking = bookings.find(booking => booking._id === bookingId);
    const total = booking.amount;
    console.log('Total:', total);
    navigate('/tourist/checkout', { state: { from: 'bookings', bookingId, total } });
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
    <div className="p-4 bg-gray-100 min-h-screen dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl mb-4">My Bookings</h1>
      <div className="flex justify-around border-b mb-4">
        <button
          className={`p-2 ${activeTab === 'upcoming' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events
        </button>
        <button
          className={`p-2 ${activeTab === 'upcoming-paid' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('upcoming-paid')}
        >
          Upcoming Paid Events
        </button>
        <button
          className={`p-2 ${activeTab === 'recent-paid' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('recent-paid')}
        >
          Attended Events
        </button>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Booking ID</th>
              <th scope="col" className="px-6 py-3">Event Type</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Event Date</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Price</th>
              {activeTab !== 'recent-paid' && <th scope="col" className="px-6 py-3">Action</th>}
              {activeTab === 'recent-paid' && <th scope="col" className="px-6 py-3">Rating & Comment</th>}
            </tr>
          </thead>
          <tbody>
            {activeTab === 'upcoming' && upcomingBookings.map(booking => (
              <EventCard
                key={booking._id}
                booking={booking}
                baseUrl={baseUrl}
                handlePayment={handlePayment}
                handleCancel={handleCancel}
              />
            ))}
            {activeTab === 'attended' && attendedBookings.map(booking => (
              <EventCard
                key={booking._id}
                booking={booking}
                baseUrl={baseUrl}
                handlePayment={handlePayment}
                handleCancel={handleCancel}
              />
            ))}
            {activeTab === 'upcoming-paid' && upcomingPaidEvents.map(event => (
              <EventCard
                key={event._id}
                booking={event}
                baseUrl={baseUrl}
                handlePayment={handlePayment}
                handleCancel={handleCancel}
              />
            ))}
            {activeTab === 'recent-paid' && recentPaidEvents.map(event => (
              <EventCard
                key={event._id}
                booking={event}
                baseUrl={baseUrl}
                handlePayment={handlePayment}
                handleCancel={handleCancel}
                showRatingComment={true}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsPage;
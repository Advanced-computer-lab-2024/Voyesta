// frontend/src/newComponents/BookingPopup.jsx
import React, { useState } from 'react';

const BookingPopup = ({ itinerary, onClose, onBook }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleBook = () => {
    if (selectedDate) {
      onBook(selectedDate);
    } else {
      alert('Please select a date.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl mb-4">Book Itinerary: {itinerary.name}</h2>
        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
          Select Date
        </label>
        <select
          id="eventDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
        >
          <option value="">Select a date</option>
          {itinerary.availableDates.map((date) => (
            <option key={date} value={date}>
              {new Date(date).toLocaleDateString()}
            </option>
          ))}
        </select>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-500 text-white rounded-lg p-2 mr-2 hover:bg-gray-700">
            Cancel
          </button>
          <button onClick={handleBook} className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-700">
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPopup;
import React, { useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets'; // Adjust the import path as necessary
import BookingPopup from './BookingPopup';
import ErrorPopup from './ErrorPopup'; // Import the ErrorPopup component


const ItineraryItem = ({ itinerary, baseUrl, fetchItineraries, role, convertedPrice, targetCurrency }) => {

  const convertDateToInputFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(itinerary.name);
  const [tourLanguage, setTourLanguage] = useState(itinerary.tourLanguage);
  const [tourPrice, setTourPrice] = useState(itinerary.tourPrice);
  const [availableDates, setAvailableDates] = useState(itinerary.availableDates.map(date => convertDateToInputFormat(date)).join(', '));
  const [activities, setActivities] = useState(itinerary.activities.map(activity => activity.name).join(', '));
  const [durations, setDurations] = useState(itinerary.durations.join(', '));
  const [accessibility, setAccessibility] = useState(itinerary.accessibility.join(', '));
  const [pickUpLocation, setPickUpLocation] = useState(`${itinerary.pickUpLocation.lat}, ${itinerary.pickUpLocation.lng}`);
  const [dropOffLocation, setDropOffLocation] = useState(`${itinerary.dropOffLocation.lat}, ${itinerary.dropOffLocation.lng}`);
  const [bookingActive, setBookingActive] = useState(itinerary.bookingActive);
  const [inappropriate, setInappropriate] = useState(itinerary.inappropriate);
  const [showPopup, setShowPopup] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false); // State for error popup

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const handleDelete = async (id) => {
    try {
      const url = `${baseUrl}/deleteItinerary/${id}`;
      await axios.delete(url, getAuthHeaders());
      fetchItineraries();
    } catch (error) {
      setErrorMessage(error.response.data.error); // Set the error message
      setIsErrorPopupOpen(true); // Open the error popup
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      // Convert the text inputs to the appropriate formats
      const updatedItinerary = {
        ...itinerary,
        name,
        tourLanguage,
        tourPrice: parseFloat(tourPrice),
        availableDates: availableDates.split(',').map(date => new Date(date.trim())),
        activities: activities.split(',').map(name => name.trim()),
        durations: durations.split(',').map(duration => parseInt(duration.trim())),
        accessibility: accessibility.split(',').map(item => item.trim()),
        pickUpLocation: {
          lat: parseFloat(pickUpLocation.split(',')[0].trim()),
          lng: parseFloat(pickUpLocation.split(',')[1].trim())
        },
        dropOffLocation: {
          lat: parseFloat(dropOffLocation.split(',')[0].trim()),
          lng: parseFloat(dropOffLocation.split(',')[1].trim())
        }
      };

      const url = `${baseUrl}/updateItinerary/${updatedItinerary._id}`;
      await axios.put(url, updatedItinerary, getAuthHeaders());
      setIsEditing(false);
      fetchItineraries();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(itinerary.name);
    setTourLanguage(itinerary.tourLanguage);
    setTourPrice(itinerary.tourPrice);
    setAvailableDates(itinerary.availableDates.map(date => convertDateToInputFormat(date)).join(', '));
    setActivities(itinerary.activities.map(activity => activity.name).join(', '));
    setDurations(itinerary.durations.join(', '));
    setAccessibility(itinerary.accessibility.join(', '));
    setPickUpLocation(`${itinerary.pickUpLocation.lat}, ${itinerary.pickUpLocation.lng}`);
    setDropOffLocation(`${itinerary.dropOffLocation.lat}, ${itinerary.dropOffLocation.lng}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const toggleBookingStatus = async () => {
    try {
      const url = `${baseUrl}/itineraries/${itinerary._id}/booking-status`;
      await axios.patch(url, { bookingActive: !bookingActive }, getAuthHeaders());
      setBookingActive(!bookingActive);
      fetchItineraries();
    } catch (error) {
      console.log(error);
    }
  };

  const flagAsInappropriate = async () => {
    try {
      const url = `${baseUrl}/flagInappropriate/${itinerary._id}`;
      await axios.patch(url, {}, getAuthHeaders());
      setInappropriate(true);
      fetchItineraries();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async (eventDate) => {
    try {
      const url = `${baseUrl}/BookEvent/${itinerary._id}`;
      await axios.post(url, { bookableModel: 'Itinerary', eventDate }, getAuthHeaders());
      alert('Booking successful!');
      setShowPopup(false);
      window.location.href = '/tourist/bookings';
    } catch (error) {
      console.error('Error booking itinerary:', error);
      alert('Error booking itinerary.');
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard');
    }).catch((err) => {
      console.error('Failed to copy link: ', err);
    });
  };

  const handleShareViaEmail = (link) => {
    window.location.href = `mailto:?subject=Check this out&body=${link}`;
  };

  const generateShareLink = (itineraryId) => {
    const link = `${window.location.origin}/itinerary/${itineraryId}`;
    setShareLink(link);
    return link;
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md mb-2">
      {isEditing ? (
        <>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
            />
          </div>
          <div>
            <label>Tour Language:</label>
            <input
              type="text"
              value={tourLanguage}
              onChange={(e) => setTourLanguage(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
            />
          </div>
          <div>
            <label>Tour Price:</label>
            <input
              type="text"
              value={tourPrice}
              onChange={(e) => setTourPrice(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
            />
          </div>
          <div>
            <label>Available Dates:</label>
            <input
              type="text"
              value={availableDates}
              onChange={(e) => setAvailableDates(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
            />
          </div>
          <div>
            <label>Activities:</label>
            <input
              type="text"
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
            />
          </div>
          <div>
            <label>Durations:</label>
            <input
              type="text"
              value={durations}
              onChange={(e) => setDurations(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
            />
          </div>
          <div>
            <label>Accessibility:</label>
            <input
              type="text"
              value={accessibility}
              onChange={(e) => setAccessibility(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
            />
          </div>
          <div>
            <label>Pick-Up Location:</label>
            <input
              type="text"
              value={pickUpLocation}
              onChange={(e) => setPickUpLocation(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
            />
          </div>
          <div>
            <label>Drop-Off Location:</label>
            <input
              type="text"
              value={dropOffLocation}
              onChange={(e) => setDropOffLocation(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
            />
          </div>
          <div className="flex justify-between mt-2 h-8">
            <img
              onClick={handleCancel}
              src={assets.cancelIcon}
              className="w-7 h-7 cursor-pointer"
            />
            <img
              onClick={handleSave}
              src={assets.submitIcon}
              className="w-9 h-9 cursor-pointer"
            />  
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold">{itinerary.name}</h2>
          <p>Language: {itinerary.tourLanguage}</p>
          <p>Price: {convertedPrice ? `${convertedPrice.toFixed(2)} ${targetCurrency}` : `${itinerary.tourPrice.toFixed(2)} USD`}</p>
          <p>Available Dates: {itinerary.availableDates.map(date => formatDate(date)).join(', ')}</p>
          <p>Activities: {itinerary.activities.map(activity => activity.name).join(', ')}</p>
          <p>Tags: {itinerary.tags.map(tag => tag.Name).join(', ')}</p>
          <p>Locations: {itinerary.locations.map(loc => `(${loc.lat}, ${loc.lng})`).join(', ')}</p>
          <p>Timeline: {itinerary.timeline.join(', ')}</p>
          <p>Durations: {itinerary.durations.join(', ')}</p>
          <p>Accessibility: {itinerary.accessibility.join(', ')}</p>
          <p>Pick-Up Location: ({itinerary.pickUpLocation.lat}, {itinerary.pickUpLocation.lng})</p>
          <p>Drop-Off Location: ({itinerary.dropOffLocation.lat}, {itinerary.dropOffLocation.lng})</p>
          <p>Status: {bookingActive ? "Active" : "Inactive"}</p>
          {role === ("admin" || "tourGuide") && <p>Inappropriate: {inappropriate ? "Yes" : "No"}</p>}
          {role === "tourGuide" &&<div className="flex justify-between mt-2 ">  
            <img
              onClick={() => handleDelete(itinerary._id)}
              src={assets.deleteIcon}
              className="w-6 h-6 cursor-pointer"
            />
            <img
              onClick={handleEdit}
              src={assets.editIcon}
              className="w-6 h-6 cursor-pointer"
            />
            <img
              onClick={toggleBookingStatus}
              src={assets.toggleIcon}
              className="w-6 h-6 cursor-pointer"
            />
          </div>
          }
          {role === 'admin' && <img
              onClick={flagAsInappropriate}
              src={assets.flagIcon}
              className="w-6 h-6 cursor-pointer"
              alt="Flag Icon"
            />
          }
          {role === "tourist" && (
            <>
              <button
                onClick={() => setShowPopup(true)}
                className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
              >
                Book Itinerary
              </button>
              <button onClick={() => {
                const link = generateShareLink(itinerary._id);
                handleCopyLink(link);
              }} className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700">
                Share via Copy Link
              </button>
              <button onClick={() => {
                const link = generateShareLink(itinerary._id);
                handleShareViaEmail(link);
              }} className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700">
                Share via Email
              </button>
              {showPopup && (
                <BookingPopup
                  item={itinerary}
                  itemType="itinerary"
                  onClose={() => setShowPopup(false)}
                  onBook={handleBooking}
                />
              )}
            </>
          )}
        </>
      )}

      {/* Error Popup */}
      {isErrorPopupOpen && (
        <ErrorPopup
          message={errorMessage}
          onClose={() => setIsErrorPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default ItineraryItem;
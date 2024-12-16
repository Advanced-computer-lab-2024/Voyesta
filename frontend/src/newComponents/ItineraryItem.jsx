import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets'; // Adjust the import path as necessary
import BookingPopup from './BookingPopup';
import ErrorPopup from './ErrorPopup'; // Import the ErrorPopup component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt, faEnvelope, faBookmark, faBell, faFlag } from '@fortawesome/free-solid-svg-icons';
import { useNavigate , useLocation } from 'react-router-dom';
const   ItineraryItem = ({ itinerary, baseUrl, fetchItineraries, role, convertedPrice, targetCurrency }) => {
  const fallbackImage = "https://cdn.britannica.com/10/241010-049-3EB67AA2.jpg";
  const navigate = useNavigate();
  const location = useLocation();
  const convertDateToInputFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [isBookmarked, setIsBookmarked] = useState(itinerary.isBookmarked);
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
  const [bookingEnabled, setBookingEnabled] = useState(itinerary.bookingEnabled);
  useEffect(() => {
    // Fetch bookmark status when the component mounts
    const fetchBookmarkStatus = async () => {
      try {
        const response = await axios.get(`${baseUrl}/bookmarked-items`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const bookmarkedItineraries = response.data.itineraries.map(itinerary => itinerary._id);
        if (bookmarkedItineraries.includes(itinerary._id)) {
          setIsBookmarked(true);
        } else {
          setIsBookmarked(false);
        }
      } catch (error) {
        console.error('Error fetching bookmark status:', error);
      }
    };

    const fetchBookingEnabledStatus = async () => {
      try {
        const response = await axios.get(`${baseUrl}/${itinerary._id}/booking-status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setBookingEnabled(response.data.bookingEnabled);
      } catch (error) {
        console.error('Error fetching booking enabled status:', error);
      }
    };

    fetchBookmarkStatus();
    fetchBookingEnabledStatus();
    console.log(`Itinerary ${itinerary._id} bookingEnabled:`, bookingEnabled);
  }, [itinerary._id, baseUrl, bookingEnabled]);

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
      // setIsErrorPopupOpen(true); // Open the error popup
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
  const toggleBookingEnabled = async () => {
    try {
      const url = `${baseUrl}/updateBookingEnabled/${itinerary._id}`;
      await axios.patch(url, { bookingEnabled: !bookingEnabled }, getAuthHeaders());
      setBookingEnabled(!bookingEnabled);
      fetchItineraries();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
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

      const notificationUrl = `${baseUrl}/sendNotification`;
      const message = `Your itinerary "${itinerary.name}" has been flagged as inappropriate.`;
      console.log(itinerary._id);
      console.log(baseUrl);
      await axios.post(notificationUrl, { userType: 'tourGuide', itemId: itinerary._id, message }, getAuthHeaders());
      
      
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
      
      const returnToGuide = localStorage.getItem('returnToGuide');
      const fromGuide = location.state?.fromGuide;
      if (returnToGuide && fromGuide) {
        localStorage.setItem('completedBooking', 'true');
        navigate('/tourist/guide');
      } else {
        navigate('/tourist/bookings');
      }
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

  const handleBookmark = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/bookmarkItinerary`,
        { itineraryId: itinerary._id },
        getAuthHeaders()
      );
      setIsBookmarked(true); // Update UI
      // alert(response.data.message);
    } catch (error) {
      console.error('Error bookmarking itinerary:', error);
    }
  };

  const handleUnbookmark = async () => {
    try {
      const response = await axios.delete(`${baseUrl}/bookmarkItinerary`, {
        data: { itineraryId: itinerary._id },
        ...getAuthHeaders(),
      });
      setIsBookmarked(false); // Update UI
      // alert(response.data.message);
    } catch (error) {
      console.error('Error unbookmarking itinerary:', error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'tourLanguage':
        setTourLanguage(value);
        break;
      case 'tourPrice':
        setTourPrice(value);
        break;
      case 'availableDates':
        setAvailableDates(value);
        break;
      case 'activities':
        setActivities(value);
        break;
      case 'durations':
        setDurations(value);
        break;
      case 'accessibility':
        setAccessibility(value);
        break;
      case 'pickUpLocation':
        setPickUpLocation(value);
        break;
      case 'dropOffLocation':
        setDropOffLocation(value);
        break;
      default:
        break;
    }
  };
  const handleSubmit = async () => {
    const itineraryData = {
      ...itinerary,
      name,
      tourLanguage,
      tourPrice: parseFloat(tourPrice),
      availableDates: availableDates.split(',').map(date => date.trim()),
      activities: activities.split(',').map(activity => activity.trim()),
      durations: durations.split(',').map(duration => duration.trim()),
      accessibility: accessibility.split(',').map(access => access.trim()),
      pickUpLocation: {
        lat: parseFloat(pickUpLocation.split(',')[0].trim()),
        lng: parseFloat(pickUpLocation.split(',')[1].trim())
      },
      dropOffLocation: {
        lat: parseFloat(dropOffLocation.split(',')[0].trim()),
        lng: parseFloat(dropOffLocation.split(',')[1].trim())
      }
    };
    console.log(itineraryData);
    try {
      const url = `${baseUrl}/updateItinerary/${itinerary._id}`;
      await axios.put(url, itineraryData, getAuthHeaders());
      fetchItineraries();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
    window.location.reload();
  };


  const toggleBookmark = () => {
    if (isBookmarked) {
      handleUnbookmark();
    } else {
      handleBookmark();
    }
  };

  const handleNotifyMe = async () => {
    try {
      const url = `${baseUrl}/requestNotification`;
      await axios.post(url, { itemId: itinerary._id, itemType: 'itinerary' }, getAuthHeaders());
  
      
    } catch (error) {
      console.error('Error requesting notification:', error);
    }
  };

  return (
    <div className="activity-item flex flex-col h-full overflow-hidden hover:scale-105 transition-transform duration-300 mb-6 ">
      {isEditing ? (
  <>
    <div className="relative z-0 w-full mb-5 group text-left">
      <input
        type="text"
        name="name"
        value={name}
        onChange={handleChange}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
      />
      <label
        htmlFor="name"
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Name
      </label>
    </div>

    <div className="relative z-0 w-full mb-5 group text-left">
      <input
        type="text"
        name="tourLanguage"
        value={tourLanguage}
        onChange={handleChange}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
      />
      <label
        htmlFor="tourLanguage"
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Tour Language
      </label>
    </div>

    <div className="relative z-0 w-full mb-5 group text-left">
      <input
        type="text"
        name="tourPrice"
        value={tourPrice}
        onChange={handleChange}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
      />
      <label
        htmlFor="tourPrice"
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Tour Price
      </label>
    </div>

    <div className="relative z-0 w-full mb-5 group text-left">
      <input
        type="text"
        name="availableDates"
        value={availableDates}
        onChange={handleChange}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
      />
      <label
        htmlFor="availableDates"
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Available Dates
      </label>
    </div>

    <div className="relative z-0 w-full mb-5 group text-left">
      <input
        type="text"
        name="activities"
        value={activities}
        onChange={handleChange}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
      />
      <label
        htmlFor="activities"
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Activities
      </label>
    </div>

    <div className="relative z-0 w-full mb-5 group text-left">
      <input
        type="text"
        name="durations"
        value={durations}
        onChange={handleChange}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
      />
      <label
        htmlFor="durations"
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Durations
      </label>
    </div>

    <div className="relative z-0 w-full mb-5 group text-left">
      <input
        type="text"
        name="accessibility"
        value={accessibility}
        onChange={handleChange}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
      />
      <label
        htmlFor="accessibility"
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Accessibility
      </label>
    </div>

    <div className="relative z-0 w-full mb-5 group text-left">
      <input
        type="text"
        name="pickUpLocation"
        value={pickUpLocation}
        onChange={handleChange}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
      />
      <label
        htmlFor="pickUpLocation"
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Pick-Up Location
      </label>
    </div>

    <div className="relative z-0 w-full mb-5 group text-left">
      <input
        type="text"
        name="dropOffLocation"
        value={dropOffLocation}
        onChange={handleChange}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
      />
      <label
        htmlFor="dropOffLocation"
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Drop-Off Location
      </label>
    </div>

    <div className="flex justify-between mt-2 h-8 text-left">
      <img
        onClick={handleSubmit}
        src={assets.submitIcon}
        className="w-9 h-9 cursor-pointer"
      />
      <img
        onClick={() => setIsEditing(false)}
        src={assets.cancelIcon}
        className="w-9 h-9 cursor-pointer"
      />
    </div>
  </>
) : (
  // Display mode code here

        <>
          <div className="activity-item flex flex-col h-full">
            {/* Image Section */}
            <img 
              src={itinerary.imageUrl || fallbackImage} 
              alt={itinerary.name} 
              className="w-full h-48 object-cover"
            />
  
            {/* Content Section */}
            <div className="p-4 flex flex-col space-y-3">
              {/* Title */}
              <h3 className="font-bold text-xl text-gray-800">{itinerary.name}</h3>
  
              {/* Info Grid */}
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <span className="font-medium text-gray-800">Language:</span> {itinerary.tourLanguage}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Price:</span>{' '}
                  {convertedPrice
                    ? `${convertedPrice.toFixed(2)} ${targetCurrency}`
                    : `${itinerary.tourPrice.toFixed(2)} USD`}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Available Dates:</span>{' '}
                  {itinerary.availableDates.map(formatDate).join(', ')}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Activities:</span>{' '}
                  {itinerary.activities.map((activity) => activity.name).join(', ')}
                </p>
                {itinerary.tags && (
                  <p>
                    <span className="font-medium text-gray-800">Tags:</span>{' '}
                    {itinerary.tags.map(tag => tag.Name).join(', ')}
                  </p>
                )}
                <p>
                  <span className="font-medium text-gray-800">Accessibility:</span>{' '}
                  {itinerary.accessibility.join(', ')}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Duration:</span>{' '}
                  {itinerary.durations.join(', ')}
                </p>
              </div>
  
              {/* Location Info */}
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">Pick-Up:</span>{' '}
                  ({itinerary.pickUpLocation.lat}, {itinerary.pickUpLocation.lng})
                </p>
                <p>
                  <span className="font-medium text-gray-800">Drop-Off:</span>{' '}
                  ({itinerary.dropOffLocation.lat}, {itinerary.dropOffLocation.lng})
                </p>
              </div>
  
              {/* Status */}
              <p className="text-sm">
                <span className="font-medium text-gray-800">Status:</span>{' '}
                {bookingEnabled ? "Active" : "Inactive"}
              </p>
  
              {/* Admin/TourGuide Controls */}
              {role === ("tourGuide") && (
                <div className="flex justify-between mt-auto pt-4">
                  <div className="flex space-x-4">
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
                    {role === "tourGuide" && (
                      <button
                        onClick={toggleBookingEnabled}
                        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-300"
                      >
                        {bookingEnabled ? 'Deactivate Booking' : 'Activate Booking'}
                      </button>
                    )}
                  </div>
                </div>
              )}
  
              {/* Admin Flag */}
              {role === 'admin' && (
                <div className="flex space-x-4">
                  <div
                    onClick={flagAsInappropriate}
                    className="text-blue-600 bg-gray-200 rounded-full p-2 cursor-pointer hover:bg-gray-300 transition duration-300 ease-in-out"
                  >
                    <FontAwesomeIcon 
                      icon={faFlag} 
                      style={{ cursor: 'pointer', color: inappropriate ? 'red' : 'gray' }} 
                    />
                  </div>
                </div>
              )}
  
              {/* Tourist Controls */}
              {role === "tourist" && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setShowPopup(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg py-2 px-4 hover:from-blue-600 hover:to-blue-800 transition duration-300 ease-in-out"
                  >
                    Book Now
                  </button>
                  <div className="flex items-center space-x-3">
                    <div
                      onClick={toggleBookmark}
                      className="cursor-pointer hover:text-yellow-400 transition duration-300"
                    >
                      <FontAwesomeIcon 
                        icon={faBookmark} 
                        className="text-xl"
                        style={{ color: isBookmarked ? 'gold' : 'gray' }}
                      />
                    </div>
                    {!bookingEnabled && (
                      <div
                        onClick={handleNotifyMe}
                        className="cursor-pointer hover:text-green-700"
                      >
                        <FontAwesomeIcon 
                          icon={faBell} 
                          className="text-xl text-green-500 hover:text-green-700" 
                        />
                      </div>
                    )}
                    <div
                      onClick={() => {
                        const link = generateShareLink(itinerary._id);
                        handleCopyLink(link);
                      }}
                      className="cursor-pointer hover:text-blue-700 transition duration-300"
                    >
                      <FontAwesomeIcon icon={faShareAlt} className="text-blue-600 text-xl" />
                    </div>
                    <div
                      onClick={() => {
                        const link = generateShareLink(itinerary._id);
                        handleShareViaEmail(link);
                      }}
                      className="cursor-pointer hover:text-blue-700 transition duration-300"
                    >
                      <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 text-xl" />
                    </div>
                  </div>
                </div>
              )}
  
              {/* Booking Popup */}
              {showPopup && (
                <BookingPopup
                  item={itinerary}
                  itemType="itinerary"
                  onClose={() => setShowPopup(false)}
                  onBook={handleBooking}
                />
              )}
            </div>
          </div>
        </>
      )}
  
     
    </div>
  );
};

export default ItineraryItem;
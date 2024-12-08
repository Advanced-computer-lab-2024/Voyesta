import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventCard = ({ booking, baseUrl, handlePayment, handleCancel }) => {
  const { bookableModel, bookable } = booking;
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [tourGuideRating, setTourGuideRating] = useState('');
  const [tourGuideComment, setTourGuideComment] = useState('');
  const [message, setMessage] = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [hasCommented, setHasCommented] = useState(false);
  const [hasRatedTourGuide, setHasRatedTourGuide] = useState(false);
  const [hasCommentedTourGuide, setHasCommentedTourGuide] = useState(false);
  const today = new Date();

  useEffect(() => {
    checkIfRatedAndCommented();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const checkIfRatedAndCommented = async () => {
    try {
      const response = await axios.get(`${baseUrl}/check${bookableModel}RatingAndComment/${bookable._id}`, getAuthHeaders());
      setHasRated(response.data.hasRated);
      setHasCommented(response.data.hasCommented);

      if (bookableModel === 'Itinerary') {
        const tourGuideResponse = await axios.get(`${baseUrl}/checkTourGuideRatingAndComment/${bookable.createdBy}?itineraryId=${bookable._id}`, getAuthHeaders());
        setHasRatedTourGuide(tourGuideResponse.data.hasRated);
        setHasCommentedTourGuide(tourGuideResponse.data.hasCommented);
      }
    } catch (error) {
      console.error('Error checking rating and comment status:', error);
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleTourGuideRatingChange = (newRating) => {
    setTourGuideRating(newRating);
  };

  const handleTourGuideCommentChange = (e) => {
    setTourGuideComment(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const ratingUrl = bookableModel === 'Activity' ? `${baseUrl}/activityRate/${bookable._id}` : `${baseUrl}/itineraryRate/${bookable._id}`;
      const commentUrl = bookableModel === 'Activity' ? `${baseUrl}/activityComment/${bookable._id}` : `${baseUrl}/itineraryComment/${bookable._id}`;
      
      await axios.patch(ratingUrl, { rating }, getAuthHeaders());
      await axios.patch(commentUrl, { comment }, getAuthHeaders());

      if (bookableModel === 'Itinerary') {
        const tourGuideRatingUrl = `${baseUrl}/tourGuideRate/${bookable.createdBy}`;
        const tourGuideCommentUrl = `${baseUrl}/tourGuideComment/${bookable.createdBy}`;
        
        await axios.patch(tourGuideRatingUrl, { rating: tourGuideRating, itineraryId: bookable._id }, getAuthHeaders());
        await axios.patch(tourGuideCommentUrl, { comment: tourGuideComment, itineraryId: bookable._id }, getAuthHeaders());
      }

      setMessage('Rating and comment submitted successfully!');
      setHasRated(true);
      setHasCommented(true);
      setHasRatedTourGuide(true);
      setHasCommentedTourGuide(true);
    } catch (error) {
      console.error('Error submitting rating and comment:', error);
      setMessage(error.response.data.error);
    }
  };

  const isEventAttended = new Date(booking.eventDate) < new Date();

  // Check if the event is an upcoming paid event (assuming 'confirmed' status is used for paid events)
  const isUpcomingPaidEvent = booking.status === 'confirmed' && new Date(booking.eventDate) >= new Date();

  const isMoreThanTwoDays = new Date(booking.eventDate) > new Date(today.setDate(today.getDate() + 2));

  return (
    <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{booking._id}</td>
      <td className="px-6 py-4">{bookableModel}</td>
      <td className="px-6 py-4">{bookable?.name}</td>
      <td className="px-6 py-4">{new Date(booking.eventDate).toLocaleDateString()}</td>
      <td className="px-6 py-4">{booking.status}</td>
      <td className="px-6 py-4">{booking.amount}</td>
      <td className="flex items-center px-6 py-4">
        {!isUpcomingPaidEvent && !isEventAttended && (
          <>
            <button onClick={() => handlePayment(booking._id)} className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-700">
              Pay Now
            </button>
          </>
        )}
        {isUpcomingPaidEvent && isMoreThanTwoDays && (
          <>
            <button onClick={() => handleCancel(booking._id)} className="bg-red-500 text-white rounded-lg p-2 hover:bg-red-700">
              Cancel Booking
            </button>
          </>
        )}
      </td>
      {isEventAttended && (
        <td className="px-6 py-4">
          <div className="flex space-x-4">
            {!hasRated && !hasCommented && (
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rate this {bookableModel}
                </label>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`w-4 h-4 ${index < rating ? 'text-yellow-300' : 'text-gray-300'} ms-1`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                      onClick={() => handleRatingChange(index + 1)}
                    >
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                  ))}
                </div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">
                  Comment on this {bookableModel}
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={handleCommentChange}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 rounded-lg p-2.5 w-full"
                />
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white rounded-lg p-2 mt-2 hover:bg-blue-700"
                >
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          {bookableModel === 'Itinerary' && (
            <div className="flex space-x-4 mt-4">
              {!hasRatedTourGuide && !hasCommentedTourGuide && (
                <div>
                  <label htmlFor="tourGuideRating" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rate the Tour Guide
                  </label>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`w-4 h-4 ${index < tourGuideRating ? 'text-yellow-300' : 'text-gray-300'} ms-1`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                        onClick={() => handleTourGuideRatingChange(index + 1)}
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
                  </div>
                  <label htmlFor="tourGuideComment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">
                    Comment on the Tour Guide
                  </label>
                  <textarea
                    id="tourGuideComment"
                    value={tourGuideComment}
                    onChange={handleTourGuideCommentChange}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 rounded-lg p-2.5 w-full"
                  />
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white rounded-lg p-2 mt-2 hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </td>
      )}
    </tr>
  );
};

export default EventCard;
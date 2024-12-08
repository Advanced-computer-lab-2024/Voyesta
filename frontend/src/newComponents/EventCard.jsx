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

  const handleRatingSubmit = async () => {
    try {
      const url = bookableModel === 'Activity' ? `${baseUrl}/activityRate/${bookable._id}` : `${baseUrl}/itineraryRate/${bookable._id}`;
      await axios.patch(url, { rating: parseInt(rating, 10) }, getAuthHeaders());
      setMessage('Rating submitted successfully!');
      setRating('');
      setHasRated(true);
    } catch (error) {
      console.error('Error submitting rating:', error);
      setMessage(error.response.data.error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const url = bookableModel === 'Activity' ? `${baseUrl}/activityComment/${bookable._id}` : `${baseUrl}/itineraryComment/${bookable._id}`;
      await axios.patch(url, { comment }, getAuthHeaders());
      setMessage('Comment submitted successfully!');
      setComment('');
      setHasCommented(true);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setMessage(error.response.data.error);
    }
  };

  const handleTourGuideRatingSubmit = async () => {
    try {
      const url = `${baseUrl}/tourGuideRate/${bookable.createdBy}`;
      await axios.patch(url, { rating: parseInt(tourGuideRating, 10), itineraryId: bookable._id }, getAuthHeaders());
      setMessage('Tour guide rating submitted successfully!');
      setTourGuideRating('');
      setHasRatedTourGuide(true);
    } catch (error) {
      console.error('Error submitting tour guide rating:', error);
      setMessage(error.response.data.error);
    }
  };

  const handleTourGuideCommentSubmit = async () => {
    try {
      const url = `${baseUrl}/tourGuideComment/${bookable.createdBy}`;
      await axios.patch(url, { comment: tourGuideComment, itineraryId: bookable._id }, getAuthHeaders());
      setMessage('Tour guide comment submitted successfully!');
      setTourGuideComment('');
      setHasCommentedTourGuide(true);
    } catch (error) {
      console.error('Error submitting tour guide comment:', error);
      setMessage(error.response.data.error);
    }
  };

  const isEventAttended = new Date(booking.eventDate) < new Date();

  // Check if the event is an upcoming paid event (assuming 'confirmed' status is used for paid events)
  const isUpcomingPaidEvent = booking.status === 'confirmed' && new Date(booking.eventDate) >= new Date();

  // if (!bookable) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md mb-2">
      <p>Booking ID: {booking._id}</p>
      <p>Event Type: {bookableModel}</p>
      <p>Name: {bookable?.name}</p>
      <p>Event Date: {new Date(booking.eventDate).toLocaleDateString()}</p>
      <p>Status: {booking.status}</p>
      <p>Price: {booking.amount}</p>

      {/* Hide payment and cancel buttons for upcoming paid events */}
      {!isUpcomingPaidEvent && !isEventAttended && (
        <>
          <button onClick={() => handlePayment(booking._id)} className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700">
            Pay Now
          </button>
          <button onClick={() => handleCancel(booking._id)} className="bg-red-500 text-white rounded-lg p-2 mt-4 hover:bg-red-700">
            Cancel Booking
          </button>
        </>
      )}

      {isEventAttended && (bookableModel === 'Activity' || bookableModel === 'Itinerary') && (
        <>
          {!hasRated && (
            <div className="mt-4">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                Rate this {bookableModel}
              </label>
              <input
                type="number"
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
                min="1"
                max="5"
              />
              <button
                onClick={handleRatingSubmit}
                className="bg-blue-500 text-white rounded-lg p-2 mt-2 hover:bg-blue-700"
              >
                Submit Rating
              </button>
            </div>
          )}
          {!hasCommented && (
            <div className="mt-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Comment on this {bookableModel}
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
              />
              <button
                onClick={handleCommentSubmit}
                className="bg-blue-500 text-white rounded-lg p-2 mt-2 hover:bg-blue-700"
              >
                Submit Comment
              </button>
            </div>
          )}
          {bookableModel === 'Itinerary' && (
            <>
              {!hasRatedTourGuide && (
                <div className="mt-4">
                  <label htmlFor="tourGuideRating" className="block text-sm font-medium text-gray-700">
                    Rate the Tour Guide
                  </label>
                  <input
                    type="number"
                    id="tourGuideRating"
                    value={tourGuideRating}
                    onChange={(e) => setTourGuideRating(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
                    min="1"
                    max="5"
                  />
                  <button
                    onClick={handleTourGuideRatingSubmit}
                    className="bg-blue-500 text-white rounded-lg p-2 mt-2 hover:bg-blue-700"
                  >
                    Submit Tour Guide Rating
                  </button>
                </div>
              )}
              {!hasCommentedTourGuide && (
                <div className="mt-4">
                  <label htmlFor="tourGuideComment" className="block text-sm font-medium text-gray-700">
                    Comment on the Tour Guide
                  </label>
                  <textarea
                    id="tourGuideComment"
                    value={tourGuideComment}
                    onChange={(e) => setTourGuideComment(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
                  />
                  <button
                    onClick={handleTourGuideCommentSubmit}
                    className="bg-blue-500 text-white rounded-lg p-2 mt-2 hover:bg-blue-700"
                  >
                    Submit Tour Guide Comment
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {message && (
        <p className={`${message.includes("successfully") ? "text-green-500" : "text-red-500"} mt-2`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default EventCard;

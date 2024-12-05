import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function TouristPurchasesView() {
  const [purchases, setPurchases] = useState([]);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  };

  useEffect(() => {
    axios.get('http://localhost:3000/api/purchase/get', getAuthHeaders())
      .then(res => setPurchases(res.data.data))
      .catch(err => console.log(err));
  }, []);

  const handleRateSubmit = (productId, rating) => {
    const url = `http://localhost:3000/api/tourist/productRate/${productId}`;
    axios.patch(url, { rating }, getAuthHeaders())
      .then(res => {
        if (res.status === 200) {
          alert('Thank you for your rating!');
          // Optionally, update the purchases state to reflect the new rating
        } else {
          alert('There was an error submitting your rating.');
        }
      })
      .catch(err => console.log(err));
  };

  const handleReviewSubmit = (event, productId) => {
    event.preventDefault();
    const url = `http://localhost:3000/api/tourist/productReview/${productId}`;
    axios.patch(url, { review }, getAuthHeaders())
      .then(res => {
        if (res.status === 200) {
          alert('Thank you for your review!');
          setReview('');
          // Optionally, update the purchases state to reflect the new review
        } else {
          alert('There was an error submitting your review.');
        }
      })
      .catch(err => console.log(err));
  };

  const ratingChanged = (newRating, productId) => {
    handleRateSubmit(productId, newRating);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center p-6">My Purchased Products</h2>
      <hr className="border-t border-gray-300 my-2" />
      {purchases.length === 0 ? (
        <p className="text-center text-lg">No purchases found.</p>
      ) : (
        <div className="space-y-4">
          {purchases.map(purchase => (
            <div key={purchase._id} className="relative flex flex-col bg-white shadow-lg p-6 rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 w-80 h-auto mx-auto">
              <div className="flex items-center">
                {/* Product Image */}
                <img 
                  src={purchase.productId.picture} 
                  alt={purchase.productId.name} 
                  className="w-20 h-20 rounded-md object-cover mr-4 hover:opacity-90 transition-opacity duration-300"
                />

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{purchase.productId.name}</h3>
                      <p className="text-sm text-gray-600">{purchase.productId.description}</p>
                      <p className="text-sm text-gray-600">Price: ${purchase.productId.price}</p>
                      <p className="text-sm text-gray-600">Quantity: {purchase.quantity}</p>
                    </div>
                  </div>

                  {/* Rating Form */}
                  <div className="mt-2">
                    <label htmlFor={`rating-${purchase.productId._id}`} className="block text-sm font-medium text-gray-700">Rating:</label>
                    <ReactStars
                      count={5}
                      onChange={(newRating) => ratingChanged(newRating, purchase.productId._id)}
                      size={24}
                      activeColor="#ffd700"
                      value={purchase.productId.rating || 0}
                    />
                  </div>
                </div>
              </div>

              {/* Review Form */}
              <form onSubmit={(e) => handleReviewSubmit(e, purchase.productId._id)} className="mt-4 flex items-center">
                <label htmlFor={`review-${purchase.productId._id}`} className="block text-sm font-medium text-gray-700 mr-2">Review:</label>
                <textarea
                  id={`review-${purchase.productId._id}`}
                  name="review"
                  value={selectedProduct === purchase.productId._id ? review : ''}
                  onChange={(e) => {
                    setSelectedProduct(purchase.productId._id);
                    setReview(e.target.value);
                  }}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full h-24 resize-none"
                />
                <button type="submit" className="ml-2 text-green-500 hover:text-green-700 transition-colors duration-300">
                  <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TouristPurchasesView;
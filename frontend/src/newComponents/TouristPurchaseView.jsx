import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TouristPurchasesView() {
  const [purchases, setPurchases] = useState([]);
  const [rating, setRating] = useState('');
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

  const handleRateSubmit = (event, productId) => {
    event.preventDefault();
    const url = `http://localhost:3000/api/tourist/productRate/${productId}`;
    axios.patch(url, { rating }, getAuthHeaders())
      .then(res => {
        if (res.status === 200) {
          alert('Thank you for your rating!');
          setRating('');
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

  return (
    <div className="purchases-view">
      <h2 className="text-lg font-bold">My Purchased Products</h2>
      {purchases.length === 0 ? (
        <p>No purchases found.</p>
      ) : (
        purchases.map(purchase => (
          <div key={purchase._id} className="purchase-item bg-[#f5e1b4] shadow-md rounded-md p-4 mb-4">
            <h3 className="text-lg font-bold">{purchase.productId.name}</h3>
            <p className="text-gray-600">{purchase.productId.description}</p>
            <p className="text-gray-600">Price: ${purchase.productId.price}</p>
            <p className="text-gray-600">Quantity: {purchase.quantity}</p>
            <form onSubmit={(e) => handleRateSubmit(e, purchase.productId._id)}>
              <label htmlFor={`rating-${purchase.productId._id}`}>Rating:</label>
              <input
                type="text"
                id={`rating-${purchase.productId._id}`}
                name="rating"
                value={selectedProduct === purchase.productId._id ? rating : ''}
                onChange={(e) => {
                  setSelectedProduct(purchase.productId._id);
                  setRating(e.target.value);
                }}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <br />
              <button type="submit" className="bg-blue-500 text-white rounded-md p-2 mt-2">Submit Rating</button>
            </form>
            <form onSubmit={(e) => handleReviewSubmit(e, purchase.productId._id)} className="mt-4">
              <label htmlFor={`review-${purchase.productId._id}`}>Review:</label>
              <textarea
                id={`review-${purchase.productId._id}`}
                name="review"
                value={selectedProduct === purchase.productId._id ? review : ''}
                onChange={(e) => {
                  setSelectedProduct(purchase.productId._id);
                  setReview(e.target.value);
                }}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <br />
              <button type="submit" className="bg-green-500 text-white rounded-md p-2 mt-2">Submit Review</button>
            </form>
          </div>
        ))
      )}
    </div>
  );
}

export default TouristPurchasesView;
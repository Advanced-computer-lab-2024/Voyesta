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
    <div className="relative overflow-x-auto shadow-md ">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-16 py-3">
              <span className="sr-only">Image</span>
            </th>
            <th scope="col" className="px-6 py-3">
              Product
            </th>
            <th scope="col" className="px-6 py-3">
              Qty
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {purchases.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-lg py-4">No purchases found.</td>
            </tr>
          ) : (
            purchases.map(purchase => (
              <tr key={purchase._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="p-4">
                  <img 
                    src={purchase.productId.picture} 
                    alt={purchase.productId.name} 
                    className="w-16 md:w-32 max-w-full max-h-full"
                  />
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {purchase.productId.name}
                  <p className="text-sm text-gray-600">{purchase.productId.description}</p>
                </td>
                <td className="px-6 py-4">
                  {purchase.quantity}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  ${purchase.productId.price}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <ReactStars
                        count={5}
                        onChange={(newRating) => ratingChanged(newRating, purchase.productId._id)}
                        size={24}
                        activeColor="#ffd700"
                        value={purchase.productId.rating || 0}
                      />
                    </div>
                    <form onSubmit={(e) => handleReviewSubmit(e, purchase.productId._id)} className="flex items-center">
                      <textarea
                        id={`review-${purchase.productId._id}`}
                        name="review"
                        value={selectedProduct === purchase.productId._id ? review : ''}
                        onChange={(e) => {
                          setSelectedProduct(purchase.productId._id);
                          setReview(e.target.value);
                        }}
                        required
                        className="border border-gray-500 rounded-md p-2 w-full h-min resize-none bg-gray-700"
                      />
                      <button type="submit" className="ml-2 text-blue-500 hover:text-blue-700 transition-colors duration-300">
                        <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TouristPurchasesView;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCartPlus } from '@fortawesome/free-solid-svg-icons';

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  };

  useEffect(() => {
    axios.get('http://localhost:3000/api/tourist/ViewList', getAuthHeaders())
      .then(res => {
        setWishlistItems(res.data.wishlist);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch wishlist items');
        setLoading(false);
      });
  }, []);

  const handleDelete = (productId) => {
    const url = `http://localhost:3000/api/tourist/deleteWish`;
    axios.delete(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      data: { productId }
    })
      .then(res => {
        if (res.status === 200) {
          setWishlistItems(wishlistItems.filter(item => item._id !== productId));
          setSuccessMessage('Product removed from wishlist successfully!');
          setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
        } else {
          alert('There was an error removing the product from the wishlist.');
        }
      })
      .catch(err => console.log(err));
  };

  const handleMoveToCart = (productId) => {
    const url = `http://localhost:3000/api/tourist/moveToCart`;
    axios.post(url, { productId }, getAuthHeaders())
      .then(res => {
        if (res.status === 200) {
          setWishlistItems(wishlistItems.filter(item => item._id !== productId));
          setSuccessMessage('Product moved to cart successfully!');
          setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
        } else {
          alert('There was an error moving the product to the cart.');
        }
      })
      .catch(err => console.log(err));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center p-10">Your Wishlist</h2>
      {successMessage && (
        <div className="text-green-500 text-center mb-4">{successMessage}</div>
      )}
      {wishlistItems.length === 0 ? (
        <p className="text-center text-lg">Your wishlist is empty</p>
      ) : (
        <div className="space-y-6">
          {wishlistItems.map(item => (
            <div key={item._id} className="relative flex flex-col bg-white shadow-lg p-6 pr-10 rounded-lg h-40 w-3/4 mx-auto border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center">
                {/* Product Image */}
                <img 
                  src={item.picture} 
                  alt={item.name} 
                  className="w-16 h-16 rounded-md object-cover mr-4 hover:opacity-90 transition-opacity duration-300"
                />

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-lg">{item.name}</div>
                      <div className="text-sm text-gray-500 font-bold">Price: ${item.price}</div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      {/* Bin Icon (Delete) */}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-gray-600 hover:text-red-500"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add to Cart Icon */}
              <FontAwesomeIcon
                icon={faCartPlus}
                className="absolute bottom-2 right-8 text-blue-500 hover:text-blue-700 transition-colors duration-300 cursor-pointer"
                onClick={() => handleMoveToCart(item._id)}
                style={{ fontSize: '1.75rem' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
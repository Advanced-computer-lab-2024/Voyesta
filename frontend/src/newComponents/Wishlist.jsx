import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  const fetchWishlistItems = () => {
    axios.get('http://localhost:3000/api/tourist/ViewList', getAuthHeaders())
      .then(res => {
        setWishlistItems(res.data.wishlist);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch wishlist items');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWishlistItems();
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
          fetchWishlistItems();
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
          setTimeout(() => setSuccessMessage(''), 3000);
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
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md flex-grow">
        <h2 className="text-2xl font-bold text-center p-10 text-white">Your Wishlist</h2>
        {successMessage && (
          <div className="text-green-500 text-center mb-4">{successMessage}</div>
        )}
        {wishlistItems.length === 0 ? (
          <p className="text-center text-lg">Your wishlist is empty</p>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-grow">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-16 py-3">
                    <span className="sr-only">Image</span>
                  </th>
                  <th scope="col" className="px-6 py-3">Product</th>
                  <th scope="col" className="px-6 py-3">Price</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {wishlistItems.map((item) => (
                  <tr key={item._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="p-4">
                      <img src={item.picture} className="w-16 md:w-32 max-w-full max-h-full" alt={item.name} />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{item.name}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <button onClick={() => handleMoveToCart(item._id)} className="text-blue-500 hover:text-blue-700">
                          Add to Cart
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
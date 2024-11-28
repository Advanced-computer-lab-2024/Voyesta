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
    axios.delete(url,getAuthHeaders(), { productId } )
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
    axios.post(url, { productId },getAuthHeaders())
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
    <div className="wishlist-page">
      <h2 className="text-lg font-bold text-center p-10">Your Wishlist</h2>
      {successMessage && (
        <div className="text-green-500 text-center mb-4">{successMessage}</div>
      )}
      {wishlistItems.length === 0 ? (
        <p className="text-center">Your wishlist is empty</p>
      ) : (
        <table className="min-w-full bg-gray-100 shadow rounded">
          <thead>
            <tr>
              <th className="py-2">Product Name</th>
              <th className="py-2">Price</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wishlistItems.map(item => (
              <tr key={item._id} className='text-center'>
                <td className="py-2">{item.name}</td>
                <td className="py-2">{item.price}</td>
                <td className="py-2">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white rounded-md p-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleMoveToCart(item._id)}
                    className="bg-blue-500 text-white rounded-md p-2 ml-2"
                  >
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Wishlist;
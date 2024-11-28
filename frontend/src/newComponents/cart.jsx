import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  };

  useEffect(() => {
    axios.get('http://localhost:3000/api/tourist/getCart', getAuthHeaders())
      .then(res => {
        setCartItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch cart items');
        setLoading(false);
      });
  }, []);

  const handleDelete = (productId) => {
    const url = `http://localhost:3000/api/tourist/removefromCart`;
    axios.delete(url, getAuthHeaders(), { productId })
      .then(res => {
        if (res.status === 200) {
          setCartItems(cartItems.filter(item => item.productId._id !== productId));
        } else {
          alert('There was an error removing the product from the cart.');
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
    <div className="cart-page">
      <h2 className="text-lg font-bold text-center p-10">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty</p>
      ) : (
        <table className="min-w-full bg-gray-100 shadow rounded">
          <thead>
            <tr>
              <th className="py-2">Product Name</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Price</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item.productId._id} className='text-center'>
                <td className="py-2">{item.productId.name}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2">{item.productId.price}</td>
                <td className="py-2">
                  <button
                    onClick={() => handleDelete(item.productId._id)}
                    className="bg-red-500 text-white rounded-md p-2"
                  >
                    Delete
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

export default Cart;
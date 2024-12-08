import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Cart = ({ baseUrl }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [quantity, setQuantity] = useState({});
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    const url = baseUrl + '/getCart';
    axios.get(url, getAuthHeaders())
      .then(res => {
        setCartItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch cart items');
        setLoading(false);
      });
  }, [baseUrl]);

  const handleCheckout = async () => {
    const details = cartItems.map(item => {
      const name = item.productId.name.substring(0, 10);
      const quantity = item.quantity;
      const price = item.productId.price;
      return `${name}...  ${price} x${quantity} `;
    }).join(', ');
  
    const total = cartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

    navigate('/tourist/checkout', { state: { from : 'cart',total, details, cartItems } });
  };

  const handleDelete = (productId) => {
    const url = `http://localhost:3000/api/tourist/removefromCart`;
    axios.delete(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      data: { productId }
    })
      .then(res => {
        if (res.status === 200) {
          setCartItems(cartItems.filter(item => item.productId._id !== productId));
          window.location.reload(); // Refresh the window instantly
        } else {
          alert('There was an error removing the product from the cart.');
        }
      })
      .catch(err => console.log(err));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const url = `http://localhost:3000/api/tourist/updateQuantity`;
    axios.post(url, { productId, quantity: newQuantity }, getAuthHeaders())
      .then(res => {
        if (res.status === 200) {
          window.location.reload(); // Refresh the window instantly
        } else {
          alert('There was an error updating the quantity.');
        }
      })
      .catch(err => console.log(err));
  };

  const incrementQuantity = (productId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    handleQuantityChange(productId, newQuantity);
  };

  const decrementQuantity = (productId, currentQuantity) => {
    const newQuantity = currentQuantity > 0 ? currentQuantity - 1 : 0;
    handleQuantityChange(productId, newQuantity);
  };

  const handleQuantityInputChange = (productId, value) => {
    setQuantity({ ...quantity, [productId]: value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center p-10">Your Cart</h2>
      {successMessage && (
        <div className="text-green-500 text-center mb-4">{successMessage}</div>
      )}
      {cartItems.length === 0 ? (
        <p className="text-center text-lg">Your cart is empty</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map(item => (
            <div key={item.productId._id} className="relative flex flex-col bg-white shadow-lg p-6 pr-10 rounded-lg h-40 w-3/4 mx-auto border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center">
                {/* Product Image */}
                <img 
                  src={item.productId.picture} 
                  alt={item.productId.name} 
                  className="w-16 h-16 rounded-md object-cover mr-4 hover:opacity-90 transition-opacity duration-300"
                />

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-lg">{item.productId.name}</div>
                      <div className="text-sm text-gray-500">Quantity: {item.color}</div>
                    </div>
                    {/* Bin Icon (Delete) */}
                    <button
                      onClick={() => handleDelete(item.productId._id)}
                      className="text-gray-600 hover:text-red-500"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-1 mt-2">
                    <button
                      type="button"
                      onClick={() => decrementQuantity(item.productId._id, item.quantity)}
                      className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-2 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                    >
                      <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.productId._id, Number(e.target.value))}
                      className="bg-gray-50 border-x-0 border-gray-300 h-8 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-12 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="999"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => incrementQuantity(item.productId._id, item.quantity)}
                      className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-2 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                    >
                      <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="absolute bottom-2 right-8 font-semibold text-lg">
                ${item.productId.price.toFixed(2)}
              </div>
            </div>
          ))}
          <div className="flex justify-center">
            <button
              onClick={handleCheckout}
              className="mt-4 bg-green-500 text-white rounded-md p-2 w-3/4 hover:bg-green-600 transition-colors duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
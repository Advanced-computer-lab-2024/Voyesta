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
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md flex-grow">
        <h2 className="text-2xl font-bold text-center p-10 text-white">Your Cart</h2>
        {successMessage && (
          <div className="text-green-500 text-center mb-4">{successMessage}</div>
        )}
        {cartItems.length === 0 ? (
          <p className="text-center text-lg">Your cart is empty</p>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-grow">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-16 py-3">
                    <span className="sr-only">Image</span>
                  </th>
                  <th scope="col" className="px-6 py-3">Product</th>
                  <th scope="col" className="px-6 py-3">Qty</th>
                  <th scope="col" className="px-6 py-3">Price</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.productId._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="p-4">
                      <img src={item.productId.picture} className="w-16 md:w-32 max-w-full max-h-full" alt={item.productId.name} />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{item.productId.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <button className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button" onClick={() => decrementQuantity(item.productId._id, item.quantity)}>
                          <span className="sr-only">Quantity button</span>
                          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                          </svg>
                        </button>
                        <div>
                          <input type="number" className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={item.quantity} onChange={(e) => handleQuantityChange(item.productId._id, Number(e.target.value))} required />
                        </div>
                        <button className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button" onClick={() => incrementQuantity(item.productId._id, item.quantity)}>
                          <span className="sr-only">Quantity button</span>
                          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">${item.productId.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(item.productId._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-gray-100 dark:bg-gray-800 p-4 shadow-md">
        <div className="flex justify-center">
          <button
            onClick={handleCheckout}
            className="bg-green-500 text-white rounded-md p-2 w-3/4 hover:bg-green-600 transition-colors duration-300"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
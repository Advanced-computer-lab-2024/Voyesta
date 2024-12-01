import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cart({ baseUrl }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [quantity, setQuantity] = useState({});
  const navigate = useNavigate();
  
  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
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
  }, []);

  const handleCheckout =  async () => {
   
    
    
    const details = cartItems.map(item => {
      const name = item.productId.name.substring(0, 10);
      const quantity = item.quantity;
      const price = item.productId.price;
      return `${name}...  ${price} x${quantity} `;
    }).join(', ');


    const total = cartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

    navigate('/tourist/checkout', { state: { from : 'cart',total, details } });
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
    <div className="cart-page">
      <h2 className="text-lg font-bold text-center p-10">Your Cart</h2>
      {successMessage && (
        <div className="text-green-500 text-center mb-4">{successMessage}</div>
      )}
      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty</p>
      ) : (
        <div>
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
                <td className="py-2">
                  <input
                    type="number"
                    value={quantity[item.productId._id] !== undefined ? quantity[item.productId._id] : item.quantity}
                    min="1"
                    max={item.productId.available_quantity}
                    onChange={(e) => handleQuantityInputChange(item.productId._id, parseInt(e.target.value))}
                    className="w-16 p-1 border border-gray-400 rounded"
                  />
                  <button
                    onClick={() => handleQuantityChange(item.productId._id, quantity[item.productId._id] !== undefined ? quantity[item.productId._id] : item.quantity)}
                    className="bg-blue-500 text-white rounded-md p-2 ml-2"
                  >
                    Update
                  </button>
                </td>
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
        <button
        onClick={handleCheckout}
        className="mt-4 bg-green-500 text-white rounded-md p-2"
      >
        Proceed to Checkout
      </button>
      </div>
      )}
    </div>
  );
}

export default Cart;
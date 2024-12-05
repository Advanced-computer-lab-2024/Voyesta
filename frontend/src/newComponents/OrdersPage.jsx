import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const OrdersPage = ({ baseUrl }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchOrders = async () => {
    const url = `${baseUrl}/getOrders`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setOrders(data);
      setLoading(false);
      await deleteCancelledOrders(); // Automatically delete cancelled orders after fetching
    } catch (error) {
      setError('Error fetching orders');
      setLoading(false);
    }
  };

  const deleteCancelledOrders = async () => {
    const url = `${baseUrl}/deleteCancelledOrders`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setOrders(prevOrders => prevOrders.filter(order => order.status !== 'cancelled'));
        setSuccessMessage('Cancelled orders deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
      } else {
        throw new Error('Failed to delete cancelled orders');
      }
    } catch (error) {
      setError('Error deleting cancelled orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    const url = `${baseUrl}/cancelOrder/${orderId}`;
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: 'cancelled' } : order
          )
        );
        setSuccessMessage('Order cancelled successfully!');
        setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
        await deleteCancelledOrders(); // Call the function to delete cancelled orders
      } else {
        throw new Error('Failed to cancel order');
      }
    } catch (error) {
      setError('Error cancelling order');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center p-10">My Orders</h2>
      {successMessage && (
        <div className="text-green-500 text-center mb-4">{successMessage}</div>
      )}
      {orders.length === 0 ? (
        <p className="text-center text-lg">You have no orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="relative flex flex-col bg-white shadow-lg p-6 rounded-lg h-auto w-full border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center">
                {/* Order Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order._id}</h3>
                      <p className="text-sm text-gray-500"><strong>Details:</strong> {order.details}</p>
                      <p className="text-sm text-gray-500"><strong>Total:</strong> ${order.total}</p>
                      <p className="text-sm text-gray-500"><strong>Status:</strong> 
                        <span className={getStatusStyle(order.status)}>{order.status}</span>
                      </p>
                    </div>
                    {/* Cancel Order Icon */}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="text-gray-600 hover:text-red-500"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'confirmed':
      return 'text-green-500 font-bold';
    case 'cancelled':
      return 'text-red-500 font-bold';
    case 'completed':
      return 'text-blue-500 font-bold';
    default:
      return 'font-bold';
  }
};

export default OrdersPage;
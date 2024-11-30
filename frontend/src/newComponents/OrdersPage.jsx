import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersPage = ({baseUrl}) => {
  const [orders, setOrders] = useState([]);



  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  };

  const fetchOrders = async () => {
    const url = `${baseUrl}/getOrders`;
    try {
      const response = await axios.get(url,getAuthHeaders()); // Adjust the endpoint as needed
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };


  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
   const url = `${baseUrl}/cancelOrder/${orderId}`;
    try {
      await axios.patch(url,getAuthHeaders()); // Adjust the endpoint as needed
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  return (
    <div className="orders-page">
      {orders.map(order => (
        <div key={order._id} className="order-card">
          <h3>Order Details: {order.details}</h3>
          <p>Total: {order.total}</p>
          <p>Status: {order.status}</p>
          {order.status === 'confirmed' && (
            <button onClick={() => cancelOrder(order._id)}>Cancel Order</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersPage = ({ baseUrl }) => {
  const [orders, setOrders] = useState([]);

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
  };

  const fetchOrders = async () => {
    const url = `${baseUrl}/getOrders`;
    try {
      const response = await axios.get(url, getAuthHeaders());
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
    console.log(url);
    try {
      await axios.patch(url, {}, getAuthHeaders());
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.heading}>My Orders</h1>
      {orders.length === 0 ? (
        <p style={styles.emptyMessage}>You have no orders yet.</p>
      ) : (
        <div style={styles.ordersContainer}>
          {orders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              <h3 style={styles.orderTitle}>Order #{order._id}</h3>
              <p><strong>Details:</strong> {order.details}</p>
              <p><strong>Total:</strong> ${order.total}</p>
              <p><strong>Status:</strong> 
                <span style={getStatusStyle(order.status)}>{order.status}</span>
              </p>
              {order.status === 'confirmed' && (
                <button
                  style={styles.cancelButton}
                  onClick={() => cancelOrder(order._id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getStatusStyle = (status) => {
  const baseStyle = { fontWeight: 'bold', textTransform: 'capitalize' };
  switch (status) {
    case 'confirmed':
      return { ...baseStyle, color: 'green' };
    case 'cancelled':
      return { ...baseStyle, color: 'red' };
    case 'completed':
      return { ...baseStyle, color: 'blue' };
    default:
      return baseStyle;
  }
};

const styles = {
  pageContainer: {
    padding: '20px',
    fontFamily: "'Arial', sans-serif",
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#777',
  },
  ordersContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  orderCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '15px',
    width: '300px',
    textAlign: 'left',
  },
  orderTitle: {
    marginBottom: '10px',
    fontSize: '18px',
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  cancelButtonHover: {
    backgroundColor: '#ff7875',
  },
};
export default OrdersPage;

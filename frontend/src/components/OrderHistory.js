import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch orders', err);
        setError('Failed to load orders');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="order-history-container">
      <h1 className="title">My Orders</h1>
      <table className="order-table">
        <thead>
          <tr>
            <th>ORDER ID</th>
            <th>STATUS</th>
            <th>TOTAL</th>
            <th>CREATED AT</th>
            <th>PRODUCTS</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.status}</td>
              <td>₱{order.totalPrice.toFixed(2)}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>
                {order.products.map((item, index) => (
                  <p key={index}>
                    {item.productId.name} (x{item.quantity})
                  </p>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;

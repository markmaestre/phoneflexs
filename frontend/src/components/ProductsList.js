import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/ProductsList.css';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUser();

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('You must be logged in to add products to the cart');
      return;
    }

    if (user.role !== 'user') {
      alert('Only users can add products to the cart');
      return;
    }

    // Proceed with adding to cart if the user is logged in and has 'user' role
    try {
      const token = localStorage.getItem('token');
      const quantity = 1; // You can modify this to get the quantity from an input field

      const response = await axios.post('http://localhost:5000/api/cart/add-to-cart', {
        userId: user._id,
        productId,
        quantity,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      alert(response.data.message);  // You can customize this message
    } catch (err) {
      console.error(err);
      alert('Error adding product to cart');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="products-page">
      <h1>All Products</h1>
      <div className="products-container">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img 
              src={`http://localhost:5000/uploads/${product.image}`} 
              alt={product.name} 
              className="product-image" 
            />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">₱{product.price.toLocaleString()}</p>
            <p className="product-stock">Stock: {product.stocks} available</p>
            <div className="product-quantity">
              <input type="number" min="1" max={product.stocks} defaultValue="1" />
            </div>
            <div className="product-buttons">
              <button className="add-to-cart" onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
              <button className="view-details">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;

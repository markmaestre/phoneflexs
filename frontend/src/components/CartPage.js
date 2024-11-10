import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data);
      } catch (err) {
        setError('Failed to load cart');
      }
    };

    fetchCart();
  }, [navigate]);

  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/cart',
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh the cart
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(response.data);
    } catch (err) {
      setError('Failed to update cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        'http://localhost:5000/api/cart',
        {
          data: { productId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh the cart
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(response.data);
    } catch (err) {
      setError('Failed to remove item from cart');
    }
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart && cart.products.length > 0 ? (
        <div>
          {cart.products.map((item) => {
            const { product, quantity } = item;
            const subtotal = product.price * quantity;
            return (
              <div key={product._id} className="cart-item">
                <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} className="cart-item-image" />
                <h3>{product.name}</h3>
                <p>Price: ₱{product.price.toLocaleString()}</p>
                <div className="quantity">
                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    max={product.stocks}
                    onChange={(e) => updateQuantity(product._id, e.target.value)}
                  />
                </div>
                <p>Subtotal: ₱{subtotal.toLocaleString()}</p>
                <button onClick={() => removeFromCart(product._id)}>Remove</button>
              </div>
            );
          })}
          <div className="cart-total">
            <p>Total: ₱{cart.products.reduce((total, item) => total + item.product.price * item.quantity, 0).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;

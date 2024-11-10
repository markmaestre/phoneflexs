import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ProductsList.css';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch products', err);
        setError('Failed to load products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="products-page">
      <h1 className="title">All Products</h1>
      <div className="products-container">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <h2 className="product-name">{product.name}</h2>
            {product.image && (
              <img
                src={`http://localhost:5000/uploads/${product.image}`}
                alt={product.name}
                className="product-image"
              />
            )}
            <div className="product-info">
              <p><strong>Description:</strong> {product.description || 'No description available'}</p>
              <p><strong>Price:</strong> ₱{product.price.toFixed(2)}</p>
              <p><strong>Stock:</strong> {product.stocks}</p>
              <p><strong>Brand:</strong> {product.brand?.name || product.brand || 'Unknown'}</p>
              <p><strong>Rating:</strong> {product.rating || 'No rating available'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;

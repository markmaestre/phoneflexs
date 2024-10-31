import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BrandManagement = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // State for the image
  const [editingBrandId, setEditingBrandId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchBrands(token);
    }
  }, [navigate]);

  const fetchBrands = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/brands', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      } else {
        console.error('Failed to fetch brands');
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingBrandId ? 'PUT' : 'POST';
    const url = editingBrandId
      ? `http://localhost:5000/api/brands/${editingBrandId}`
      : 'http://localhost:5000/api/brands';

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) {
      formData.append('image', image); // Append the image to form data
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchBrands(token); // Refresh brands
        resetForm();
      } else {
        console.error('Failed to save brand');
      }
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  const handleEdit = (brand) => {
    setName(brand.name);
    setDescription(brand.description);
    setEditingBrandId(brand._id);
    setImage(null); // Reset image on edit
  };

  const handleDelete = async (brandId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/brands/${brandId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchBrands(token); // Refresh brands
      } else {
        console.error('Failed to delete brand');
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setImage(null);
    setEditingBrandId(null);
  };

  return (
    <div>
      <h2>Brand Management</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Brand Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Brand Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])} // Get the selected file
        />
        <button type="submit">{editingBrandId ? 'Update Brand' : 'Add Brand'}</button>
        {editingBrandId && <button onClick={resetForm}>Cancel</button>}
      </form>
      <h3>Brand List</h3>
      <ul>
        {brands.map((brand) => (
          <li key={brand._id}>
            {brand.name} - {brand.description}
            <img src={`http://localhost:5000/${brand.image}`} alt={brand.name} width="100" />
            <button onClick={() => handleEdit(brand)}>Edit</button>
            <button onClick={() => handleDelete(brand._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrandManagement;

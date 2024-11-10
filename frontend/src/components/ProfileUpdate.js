import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/profileUpdate.css';

const ProfileUpdate = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [newName, setNewName] = useState('');
    const [newImage, setNewImage] = useState(null);
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
                    const errorText = await response.text(); // Get the response as text
                    setError('Failed to fetch user data: ' + errorText); // Display HTML error response if not JSON
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                const data = await response.json(); // Try to parse JSON if the response is valid
                setUser(data.user);
                setNewName(data.user.name);
            } catch (err) {
                setError('Error fetching user data: ' + err.message); // Catch any errors and display the message
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', newName);
        if (newImage) formData.append('image', newImage);

        try {
            const response = await fetch('http://localhost:5000/api/auth/update-profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get the response as text
                throw new Error('Failed to update profile: ' + errorText); // Display HTML error response if not JSON
            }

            const updatedUser = await response.json(); // Try to parse JSON if the response is valid
            setUser(updatedUser.user);
            alert('Profile updated successfully!');
        } catch (error) {
            alert(error.message); // Display the error message if something goes wrong
        }
    };

    const handleFileChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    if (error) return <p className="error">{error}</p>; // Display error message if there's an error

    return (
        <div className="profile-update-container">
            <h2>Update Your Profile</h2>
            <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter your name"
                    />
                </div>
                <div className="form-group">
                    <label>Profile Picture:</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button type="submit" className="update-button">Update Profile</button>
            </form>
        </div>
    );
};

export default ProfileUpdate;

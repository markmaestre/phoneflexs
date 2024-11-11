  import React, { useState } from 'react';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
  import { jwtDecode as jwt_decode } from 'jwt-decode';
  import './css/login.css';

  const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
      e.preventDefault();

      setError('');
      try {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        const { token, user } = res.data;

        localStorage.setItem('token', token);

        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } catch (err) {
        if (err.response && err.response.data) {
          setError(err.response.data.msg);
        }
      }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
      const token = credentialResponse.credential;
      const decoded = jwt_decode(token);

      try {
        const res = await axios.post('http://localhost:5000/api/auth/google-login', { token });
        const { token: userToken, user } = res.data;

        localStorage.setItem('token', userToken);

        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } catch (err) {
        setError("Google login failed.");
      }
    };

    return (
      <GoogleOAuthProvider clientId="659507145364-qgqgo80l1abs1gku7rd2ta8pqmh50atv.apps.googleusercontent.com">
        <form className="login-form" onSubmit={onSubmit}>
          <h2>Login</h2>
          <div className="input-container">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="input-container">
            <i className="fas fa-lock"></i>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} onClick={() => setShowPassword(!showPassword)}></i>
          </div>
          <button type="submit">Log in</button>
          {error && <div className="error">{error}</div>}
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password">Forgot password?</a>
          </div>
          <div className="account-link">
            <p>Don't have an account? <a href="/register">Register</a></p>
          </div>

          {/* Google Login Button */}
          <div className="google-login">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setError("Google login failed.")}
            />
          </div>
        </form>
      </GoogleOAuthProvider>
    );
  };

  export default Login;
  

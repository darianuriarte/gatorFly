import React, { useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import wingImage from '../assets/image.png';
import { UserContext } from '../../context/userContext';

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: '', password: '' });
  const { setUser } = useContext(UserContext);

  const loginUser = async (event) => {
    event.preventDefault();
    const { email, password } = data;

    try {
      const response = await axios.post('/login', { email, password });
      const responseData = response.data;

      if (responseData.error) {
        toast.error(responseData.error);
      } else {
        setUser(responseData); // Update the user state in the context
        setData({ email: '', password: '' }); // Reset form fields
        toast.success('Logged in successfully'); // Success message
        navigate('/calendar'); // Navigate to dashboard or home page
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <h1>Welcome Back!</h1>
          <p>We are so glad to see you again and help you plan your next trip.</p>
          <form className="login-form" onSubmit={loginUser}>
            <label>Email</label>
            <input
              type="email"
              className="login-input"
              placeholder="Please enter your email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
            <label>Password</label>
            <input
              type="password"
              className="login-input"
              placeholder="Please enter a password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
            <button type="submit" className="login-button">Login</button>
          </form>
          <div className="login-footer">
            Need to make an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
        <img
          src={wingImage}
          alt="Wing of an airplane"
          className="login-image"
        />
      </div>
    </div>
  );
}

// Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import wingImage from '../assets/image.png';


export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { name, email, password } = data;
    try {
      const response = await axios.post('/register', {
        name,
        email,
        password,
      });
      const responseData = response.data;
      if (responseData.error) {
        toast.error(responseData.error);
      } else {
        setData({ name: '', email: '', password: '' }); // Reset form fields
        toast.success('Account registered successfully');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-content">
          <h1>Welcome to Gator Fly!</h1>
          <p>We allow you to optimize your travel so all you have to worry about is getting on the plane.</p>
          <form className="register-form" onSubmit={registerUser}>
            <label>Name</label>
            <input
              type="text"
              className="register-input"
              placeholder="Please enter your name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
            />
            <label>Email</label>
            <input
              type="email"
              className="register-input"
              placeholder="Please enter your email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
            <label>Password</label>
            <input
              type="password"
              className="register-input"
              placeholder="Please enter a password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
            <button type="submit" className="register-button">Register</button>
          </form>
          <div className="register-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
        <img
          src={wingImage}
          alt="Wing of an airplane"
          className="register-image"
        />
      </div>
    </div>
  );
}
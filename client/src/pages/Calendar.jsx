import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import microsoftLogo from '../assets/microsoftLogo.png';
import wingImage from '../assets/image.png';
import toast from 'react-hot-toast';
import { UserContext } from '../../context/userContext';

export default function Calendar() {
  const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
  const redirectUri = encodeURIComponent(import.meta.env.VITE_REDIRECT_URI);
  const scope = encodeURIComponent('user.read Calendars.Read');
  const responseType = 'code';
  const responseMode = 'query';

  const loginUrl = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}&response_mode=${responseMode}`;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [freeDateRanges, setFreeDateRanges] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

 useEffect(() => {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');
  const login = queryParams.get('login');

  if (login === 'success') {
    if (token) {
      localStorage.setItem('microsoftToken', token);
      // Optionally clear the URL to enhance security and avoid exposing the token in the browser history
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    setLoginSuccess(true);
  }
}, []);


  const handleLogin = () => {
    window.location.href = loginUrl;
  };

  const handleSearch = async () => {
  if (!startDate || !endDate) {
    toast.error('Please select both start and end dates before searching.');
    return;
  }

  const currentDate = new Date().toISOString().slice(0, 10);
  if (startDate < currentDate || endDate < currentDate) {
    toast.error('Please select a date range in the future.');
    return;
  }

  if (startDate > endDate) {
    toast.error('Start date must be earlier than end date.');
    return;
  }

  const token = localStorage.getItem('microsoftToken');
  try {
    const response = await fetch(`https://gatorfly.onrender.com/getDates?startDateTime=${startDate}T00:00:00.000Z&endDateTime=${endDate}T23:59:59.999Z`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    const data = await response.json();
    setFreeDateRanges(data.freeDateRanges);
    navigate('/flights', { state: { startDate, endDate, freeDateRanges: data.freeDateRanges } });
  } catch (error) {
    console.error('Error fetching free date ranges:', error);
    toast.error('Failed to fetch date ranges. Please try again.');
    navigate('/flights', { state: { startDate, endDate, freeDateRanges: [] } });
  }
};


  return (
    <div className="calendar-container" style={{ backgroundImage: `url(${wingImage})` }}>
      {user ? (
        <>
          {loginSuccess ? (
            <>
              <h1>Let's Find Your Perfect Trip!</h1>
              <p className="sync-text">Congrats! Your calendar has been synced. Let's find those flights!</p>
              <div className="sync-box synced">
                <img src={microsoftLogo} alt="Microsoft Logo" className="microsoft-logo" />
                <label>Choose a Date Range for your trip:</label>
                <div className="date-range">
                  <div className="date-input">
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="Start Date"
                    />
                  </div>
                  <div className="date-input">
                    <label htmlFor="endDate">End Date:</label>
                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="End Date"
                    />
                  </div>
                </div>
                <button onClick={handleSearch} className="search-button">
                  Search Available Flights
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>Welcome, {user.name}</h1>
              <p className="sync-text">Please sync your Microsoft account to access your calendar.</p>
              <div className="sync-box">
                <img src={microsoftLogo} alt="Microsoft Logo" className="microsoft-logo" />
                <button onClick={handleLogin} className="sync-button">
                  Sync Account
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <h1>Warning: You must be logged in to proceed.</h1>
          <p className="sync-text">Please log out and log back in to continue.</p>
        </>
      )}
    </div>
  );
}

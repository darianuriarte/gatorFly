import React, { useState } from 'react';

export default function Home() {
  
  const clientId = import.meta.env.VITE_AZURE_CLIENT_ID; 
  const redirectUri = encodeURIComponent(import.meta.env.VITE_REDIRECT_URI); 

  const scope = encodeURIComponent('user.read');
  const responseType = 'code';
  const responseMode = 'query';

  // Login URL for the "consumers" endpoint
  const loginUrl = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}&response_mode=${responseMode}`;

  const handleLogin = () => {
    window.location.href = loginUrl;
  };

  // State for the "From" and "To" inputs and the date range
  const [fromDestination, setFromDestination] = useState('');
  const [toDestination, setToDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div>
      <h1>Home</h1>
      <label htmlFor="from">Choose a destination:</label><br/>
      <input
        id="from"
        value={fromDestination}
        onChange={(e) => setFromDestination(e.target.value)}
        placeholder="From"
      /><br/>
      <input
        id="to"
        value={toDestination}
        onChange={(e) => setToDestination(e.target.value)}
        placeholder="To"
      /><br/>
      Choose a Date Range for your flight:<br/>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Start Date"
      /> to 
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="End Date"
      /><br/>
      <button onClick={handleLogin}>Login to your Microsoft Account to sync your calendar</button>
    </div>
  );
}

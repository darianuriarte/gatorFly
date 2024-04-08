import React, { useState, useEffect } from 'react';

export default function Home() {
  
  const clientId = import.meta.env.VITE_AZURE_CLIENT_ID; 
  const redirectUri = encodeURIComponent(import.meta.env.VITE_REDIRECT_URI); 
  const scope = encodeURIComponent('user.read Calendars.Read');
  const responseType = 'code';
  const responseMode = 'query';

  // Login URL for the "consumers" endpoint
  const loginUrl = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}&response_mode=${responseMode}`;

  const [fromDestination, setFromDestination] = useState('');
  const [toDestination, setToDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const login = queryParams.get('login');
    if (login === 'success') {
      setLoginSuccess(true);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = loginUrl;
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/getDates?startDateTime=${startDate}T00:00:00.000Z&endDateTime=${endDate}T23:59:59.999Z`, {
  credentials: 'include', // This is correct for sending cookies
});

      const data = await response.json();
      setEvents(data); // Assuming the response is the array of events
    } catch (error) {
      console.error('Error fetching calendar view:', error);
      setEvents([]);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1>Home</h1>
      {loginSuccess ? (
        <>
          <p>Microsoft Account Successfully Synchronized.</p>
          <label htmlFor="from">From:</label><br/>
          <input
            id="from"
            value={fromDestination}
            onChange={(e) => setFromDestination(e.target.value)}
            placeholder="From"
          /><br/>
          <label htmlFor="to">To:</label><br/>
          <input
            id="to"
            value={toDestination}
            onChange={(e) => setToDestination(e.target.value)}
            placeholder="To"
          /><br/>
          <label>Choose a Date Range for your flight:</label><br/>
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
          <button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
          {events.length > 0 && (
            <ul>
              {events.map(event => (
                <li key={event.id}>{event.subject} - {new Date(event.start.dateTime).toLocaleString()}</li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <button onClick={handleLogin}>Login to your Microsoft Account to sync your calendar</button>
      )}
    </div>
  );
}

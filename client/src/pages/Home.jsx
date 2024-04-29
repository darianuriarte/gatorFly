import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css'
import logo from '../microsoft.png';
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
  const [freeDateRanges, setFreeDateRanges] = useState([]);

  const navigate = useNavigate();

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
        credentials: 'include',
      });
      const data = await response.json();
      setFreeDateRanges(data.freeDateRanges);
    } catch (error) {
      console.error('Error fetching free date ranges:', error);
      setFreeDateRanges([]);
    }
    setIsLoading(false);
  };

  const handleFindFlights = () => {
    navigate('/flights', { state: { fromDestination, toDestination, startDate, endDate } });
  };

  return (
    <div className="home-container">
      {loginSuccess ? (
        <>
          <div className='searchWelcome'>
            <h1 >Welcome, Placeholder</h1>
            <p>Microsoft Account Successfully Synchronized.</p>
          </div>

          <div className='searchBox'>

            <div className='searchParams'>

              
                    <label className='searchLabel' htmlFor="from">From:</label><br />
                    <input
                    id="from"
                    value={fromDestination}
                    onChange={(e) => setFromDestination(e.target.value)}
                      placeholder="Ex: MIA or miami"
                    />
                  <div className='destinationBoxes'>
                    <label className='searchLabel' htmlFor="to">To:</label>
                    <input
                      id="to"
                      value={toDestination}
                      onChange={(e) => setToDestination(e.target.value)}
                      placeholder="Ex: JFK or New York"
                    />
                  
                </div>

                <div className='searchDates'>
                  <label>Choose a Date Range for your flight:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="End Date"
                  />
                </div>
                
              </div>
          
            <button className='searchButton' onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search Available Dates'}
            </button>

          </div>
          
          {freeDateRanges.length > 0 && (
            <>
              <h2>Available Dates:</h2>
              <table>
                <thead>
                  <tr>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {freeDateRanges.map((range, index) => (
                    <tr key={index}>
                      <td>{new Date(range.startDate).toLocaleDateString()}</td>
                      <td>{new Date(range.endDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={handleFindFlights}>Find Flights</button>
            </>
          )}
        </>
      ) : (
        <div>
          
          <div className="microsoft">

          <h1 className="home-heading">Welcome,</h1>
          <img className="image-h" src={logo} alt="Logo" />
          <div className="microsoft">
          </div>
          <p className="home-p">Please sync your Microsoft account</p>
          <button className='microsoftButton' onClick={handleLogin}>Login to your Microsoft Account to sync your calendar</button>
          </div>
          <button className="button-h" onClick={handleLogin}>Sync Account</button>
        </div>
      )}
    </div>
  );
}
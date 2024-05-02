import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlane, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import sadGator from '../assets/sadgator.png';
import vacationImage from '../assets/vacationgator.png';
import toast from 'react-hot-toast';

export default function Flights() {
  const [freeDateRanges, setFreeDateRanges] = useState([]);
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [flightType, setFlightType] = useState('one-way');
  const [selectedDateRangeIndex, setSelectedDateRangeIndex] = useState(null);
  const [flights, setFlights] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);  // Add a loading state

  const userToken = localStorage.getItem('token');

  useEffect(() => {
    const fetchFreeDateRanges = async () => {
      setIsLoading(true);  // Set loading to true when starting to fetch
      try {
        const response = await axios.get('https://gatorfly.onrender.com/freeDateRanges', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setFreeDateRanges(response.data.freeDateRanges);
      } catch (error) {
        console.error('Error fetching free date ranges:', error);
      }
      setIsLoading(false);  // Set loading to false after fetch is complete
    };

    fetchFreeDateRanges();
  }, [userToken]);

  if (isLoading) {
    return <div>Loading...</div>;  // Show loading or a default message while data is fetching
  }

  const handleSearch = async () => {
    if (selectedDateRangeIndex === null) {
      toast.error('Please select a date range');
      return;
    }

    if (!originCity || !destinationCity) {
      toast.error('Please enter both origin and destination cities');
      return;
    }

    if (originCity === destinationCity) {
      toast.error('Origin and destination cities cannot be the same');
      return;
    }

    setSearchClicked(true);
    setFlights([]); // Clear previous search results

    const selectedDateRange = freeDateRanges[selectedDateRangeIndex];

    const searchParams = {
      originCityName: originCity,
      destinationCityName: destinationCity,
      departDate: selectedDateRange.startDate,
    };

    if (flightType === 'round-trip') {
      searchParams.returnDate = selectedDateRange.endDate;
    }

    try {
      const endpoint = flightType === 'one-way' ? 'searchOneWayFlights' : 'searchRoundTripFlights';
      const response = await axios.get(`https://gatorfly.onrender.com/${endpoint}`, {
        params: searchParams,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
      toast.error('Failed to fetch flights');
    }
  };

  const calculateDuration = (departure, arrival) => {
    const departureTime = new Date(departure);
    const arrivalTime = new Date(arrival);
    const duration = Math.abs(arrivalTime - departureTime);
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="flights-container">
      <div className="dates-container">
        <h2>Available Dates:</h2>
        {freeDateRanges && freeDateRanges.length > 0 ? (
          <div className="date-boxes">
            {freeDateRanges.map((range, index) => (
              <div
                key={index}
                className={`date-card ${selectedDateRangeIndex === index ? 'selected' : ''}`}
                onClick={() => setSelectedDateRangeIndex(index)}
              >
                <div className="date-section">
                  <FaPlane className="date-icon" />
                  <span className="date-label">Departure:</span>
                  <span className="date-value">{new Date(range.startDate).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'short' })}</span>
                </div>
                <div className="date-section">
                  <FaHome className="date-icon" />
                  <span className="date-label">Return:</span>
                  <span className="date-value">{new Date(range.endDate).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'short' })}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-dates-message">
            <p>No available dates. Please select a different date range.</p>
            <Link to="/calendar?login=success">Go to Calendar</Link>
          </div>
        )}
      </div>

      <div className="search-container">
        <div className="search-bar">
          <select value={flightType} onChange={(e) => setFlightType(e.target.value)}>
            <option value="one-way">One-Way</option>
            <option value="round-trip">Round-Trip</option>
          </select>
          <input
            type="text"
            placeholder="Origin City"
            value={originCity}
            onChange={(e) => setOriginCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="Destination City"
            value={destinationCity}
            onChange={(e) => setDestinationCity(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="flight-results">
          {searchClicked && flights && flights.length === 0 && (
            <div className="loading-message">
              <img src={vacationImage} alt="Vacation Gator" className="spinning" />
            </div>
          )}
          {flights && flights.length > 0 && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Price</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Departure</th>
                    <th>Arrival</th>
                    <th>Duration</th>
                    <th>Carrier</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map((flight, index) => (
                    <React.Fragment key={index}>
                      {flightType === 'one-way' ? (
                        <tr>
                          <td>{flight.price}</td>
                          <td>{flight.origin}</td>
                          <td>{flight.destination}</td>
                          <td>{new Date(flight.departure).toLocaleString()}</td>
                          <td>{new Date(flight.arrival).toLocaleString()}</td>
                          <td>{calculateDuration(flight.departure, flight.arrival)}</td>
                          <td>{flight.carrier}</td>
                        </tr>
                      ) : flight.outbound && flight.inbound ? (
                        <>
                          <tr>
                            <td rowSpan={2}>{flight.price}</td>
                            <td>{flight.outbound.origin}</td>
                            <td>{flight.outbound.destination}</td>
                            <td>{new Date(flight.outbound.departure).toLocaleString()}</td>
                            <td>{new Date(flight.outbound.arrival).toLocaleString()}</td>
                            <td>{calculateDuration(flight.outbound.departure, flight.outbound.arrival)}</td>
                            <td>{flight.outbound.carrier}</td>
                          </tr>
                          <tr>
                            <td>{flight.inbound.origin}</td>
                            <td>{flight.inbound.destination}</td>
                            <td>{new Date(flight.inbound.departure).toLocaleString()}</td>
                            <td>{new Date(flight.inbound.arrival).toLocaleString()}</td>
                            <td>{calculateDuration(flight.inbound.departure, flight.inbound.arrival)}</td>
                            <td>{flight.inbound.carrier}</td>
                          </tr>
                        </>
                      ) : null}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!searchClicked && (
            <div className="no-results-message">
              {freeDateRanges && freeDateRanges.length === 0 ? (
                <>
                  <img src={sadGator} alt="Sad Gator" />
                </>
              ) : (
                <>
                  <img src={vacationImage} alt="Vacation Gator" />
                  <p>Please select a date range to start.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

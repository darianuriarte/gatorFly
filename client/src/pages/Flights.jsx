import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Flights() {
  const [freeDateRanges, setFreeDateRanges] = useState([]);
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [flightType, setFlightType] = useState('one-way');
  const [selectedDateRangeIndex, setSelectedDateRangeIndex] = useState(null);
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchFreeDateRanges = async () => {
      try {
        const response = await axios.get('http://localhost:8000/freeDateRanges', { withCredentials: true });
        setFreeDateRanges(response.data.freeDateRanges);
      } catch (error) {
        console.error('Error fetching free date ranges:', error);
      }
    };

    fetchFreeDateRanges();
  }, []);

  const handleSearch = async () => {
    if (selectedDateRangeIndex === null || !originCity || !destinationCity) {
      alert('Please fill all fields');
      return;
    }

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
      const response = await axios.get(`http://localhost:8000/${endpoint}`, {
        params: searchParams,
        withCredentials: true
      });
      setFlights(response.data.flights); // Assuming the response structure includes an array of flights
    } catch (error) {
      console.error('Error fetching flights:', error);
      alert('Failed to fetch flights');
    }
  };

  return (
    <div>
      <h1>Flights Search</h1>
      <div>
        <label>
          Flight Type:
          <select value={flightType} onChange={e => setFlightType(e.target.value)}>
            <option value="one-way">One-Way</option>
            <option value="round-trip">Round-Trip</option>
          </select>
        </label>
        <label>
          Origin City:
          <input type="text" value={originCity} onChange={e => setOriginCity(e.target.value)} />
        </label>
        <label>
          Destination City:
          <input type="text" value={destinationCity} onChange={e => setDestinationCity(e.target.value)} />
        </label>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        <h2>Available Dates:</h2>
        <ul>
          {freeDateRanges.map((range, index) => (
            <li key={index}
              style={{ backgroundColor: selectedDateRangeIndex === index ? 'lightgrey' : 'transparent' }}
              onClick={() => setSelectedDateRangeIndex(index)}>
              {new Date(range.startDate).toLocaleDateString()} - {new Date(range.endDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
      <div>
        {flights.length > 0 ? (
          <ul>
            {flights.map((flight, index) => (
              <li key={index}>{/* Display flight details here */}</li>
            ))}
          </ul>
        ) : (
          <p>No flights found</p>
        )}
      </div>
    </div>
  );
}
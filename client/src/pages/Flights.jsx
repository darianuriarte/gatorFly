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
        withCredentials: true,
      });
      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
      alert('Failed to fetch flights');
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
    <div>
      <h1>Flights Search</h1>
      <div>
        <label>
          Flight Type:
          <select value={flightType} onChange={(e) => setFlightType(e.target.value)}>
            <option value="one-way">One-Way</option>
            <option value="round-trip">Round-Trip</option>
          </select>
        </label>
        <label>
          Origin City:
          <input type="text" value={originCity} onChange={(e) => setOriginCity(e.target.value)} />
        </label>
        <label>
          Destination City:
          <input type="text" value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)} />
        </label>
        <button onClick={handleSearch}>Search</button>
      </div>

      <div>
        <h2>Available Dates:</h2>
        <ul>
          {freeDateRanges.map((range, index) => (
            <li
              key={index}
              style={{ backgroundColor: selectedDateRangeIndex === index ? 'lightgrey' : 'transparent' }}
              onClick={() => setSelectedDateRangeIndex(index)}
            >
              {new Date(range.startDate).toLocaleDateString()} - {new Date(range.endDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>

      {flights.length > 0 && (
        <div>
          <h2>Flight Results:</h2>
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
                <tr key={index}>
                  <td>{flight.price}</td>
                  {flightType === 'one-way' ? (
                    <>
                      <td>{flight.origin}</td>
                      <td>{flight.destination}</td>
                      <td>{new Date(flight.departure).toLocaleString()}</td>
                      <td>{new Date(flight.arrival).toLocaleString()}</td>
                      <td>{calculateDuration(flight.departure, flight.arrival)}</td>
                      <td>{flight.carrier}</td>
                    </>
                  ) : (
                    <>
                      <td>{flight.outbound.origin}</td>
                      <td>{flight.outbound.destination}</td>
                      <td>{new Date(flight.outbound.departure).toLocaleString()}</td>
                      <td>{new Date(flight.outbound.arrival).toLocaleString()}</td>
                      <td>{calculateDuration(flight.outbound.departure, flight.outbound.arrival)}</td>
                      <td>{flight.outbound.carrier}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
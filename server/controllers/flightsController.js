const axios = require('axios');

// Configure Axios for RapidAPI requests
const rapidApiAxios = axios.create({
  baseURL: 'https://sky-scanner3.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': '5c80151433msh9ddcde26a261dc2p1978dcjsnf74c2417dfe5',
    'X-RapidAPI-Host': 'sky-scanner3.p.rapidapi.com',
  },
});

// Helper function to get entity ID from city name
const getEntityIdFromName = async (cityName) => {
  try {
    const response = await rapidApiAxios.get('/flights/auto-complete', {
      params: { query: cityName },
    });
    if (response.data && response.data.data.length > 0) {
      // Assuming the first result is the most relevant
      return response.data.data[0].presentation.id;
    }
    return null; // No matching city found
  } catch (error) {
    return null;
  }
};

const formatDepartDate = (dateString) => {
  const date = new Date(dateString);
  // Ensure the date is in UTC to match the input format
  return date.toISOString().split('T')[0];
};

const searchOneWayFlights = async (req, res) => {
  const { originCityName, destinationCityName, departDate } = req.query;

  try {
    // Convert city names to entity IDs
    const fromEntityId = await getEntityIdFromName(originCityName);
    const toEntityId = await getEntityIdFromName(destinationCityName);

    if (!fromEntityId || !toEntityId) {
      return res.status(404).send('One or both cities not found');
    }

    // Format the departDate
    const formattedDepartDate = formatDepartDate(departDate);

    const response = await rapidApiAxios.get('/flights/search-one-way', {
      params: { fromEntityId, toEntityId, departDate: formattedDepartDate },
    });

    // Extract the desired data from the first 20 itineraries
    const itineraries = response.data.data.itineraries.slice(0, 20).map(itinerary => ({
      price: itinerary.price.formatted,
      origin: itinerary.legs[0].origin.displayCode,
      destination: itinerary.legs[0].destination.displayCode,
      departure: itinerary.legs[0].departure,
      arrival: itinerary.legs[0].arrival,
      carrier: itinerary.legs[0].carriers.marketing[0].name
    }));

    res.json(itineraries);
  } catch (error) {
    res.status(500).send('Error searching one-way flights');
  }
};

const searchRoundTripFlights = async (req, res) => {
  const { originCityName, destinationCityName, departDate, returnDate } = req.query;

  try {
    // Convert city names to entity IDs
    const fromEntityId = await getEntityIdFromName(originCityName);
    const toEntityId = await getEntityIdFromName(destinationCityName);

    if (!fromEntityId || !toEntityId) {
      return res.status(404).send('One or both cities not found');
    }

    // Format the departDate and returnDate
    const formattedDepartDate = formatDepartDate(departDate);
    const formattedReturnDate = formatDepartDate(returnDate);

    const response = await rapidApiAxios.get('/flights/search-roundtrip', {
      params: { fromEntityId, toEntityId, departDate: formattedDepartDate, returnDate: formattedReturnDate },
    });

    // Extract and map the desired data from the first 20 itineraries
    const itineraries = response.data.data.itineraries.slice(0, 20).map(itinerary => ({
      price: itinerary.price.formatted,
      outbound: {
        origin: itinerary.legs[0].origin.displayCode,
        destination: itinerary.legs[0].destination.displayCode,
        departure: itinerary.legs[0].departure,
        arrival: itinerary.legs[0].arrival,
        carrier: itinerary.legs[0].carriers.marketing[0].name
      },
      inbound: {
        origin: itinerary.legs[1].origin.displayCode,
        destination: itinerary.legs[1].destination.displayCode,
        departure: itinerary.legs[1].departure,
        arrival: itinerary.legs[1].arrival,
        carrier: itinerary.legs[1].carriers.marketing[0].name
      }
    }));

    res.json(itineraries);
  } catch (error) {
    res.status(500).send('Error searching round-trip flights');
  }
};



module.exports = {
  searchOneWayFlights,
  searchRoundTripFlights,
};

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
      console.log(response.data.data[0].presentation.id)
      return response.data.data[0].presentation.id;
    }
    return null; // No matching city found
  } catch (error) {
    return null;
  }
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

    console.log(departDate)
    const response = await rapidApiAxios.get('/flights/search-one-way', {
      params: { fromEntityId, toEntityId, departDate },
    });

    res.json(response.data);
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

    const response = await rapidApiAxios.get('/flights/search-roundtrip', {
      params: { fromEntityId, toEntityId, departDate, returnDate },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error searching round-trip flights');
  }
};

module.exports = {
  searchOneWayFlights,
  searchRoundTripFlights,
};

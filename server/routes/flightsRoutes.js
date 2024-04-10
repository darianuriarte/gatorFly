const express = require('express');
const router = express.Router();
const flightsController = require('../controllers/flightsController');

// Route for one-way flights search
router.get('/searchOneWayFlights', flightsController.searchOneWayFlights);

// Route for round-trip flights search
router.get('/searchRoundTripFlights', flightsController.searchRoundTripFlights);

module.exports = router;

// routes/api.js
const express = require('express');
const router = express.Router();
const { getCalendarEvents } = require('../controllers/calendarController');

// Define the route for fetching calendar events
router.get('/getDates', getCalendarEvents);

module.exports = router;

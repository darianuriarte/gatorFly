const express = require('express');
const router = express.Router();
const { getCalendarEvents } = require('../controllers/calendarController');
const { getUserFreeDateRanges } = require('../controllers/getUserFreeDateRanges');

// Define the route for fetching calendar events
router.get('/getDates', getCalendarEvents);

// Define the route for fetching user's free date ranges
router.get('/freeDateRanges', getUserFreeDateRanges);

module.exports = router;
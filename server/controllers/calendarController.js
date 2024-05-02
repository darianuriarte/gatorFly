// controllers/calendarController.js
const axios = require('axios');
const FreeDateRange = require('../models/FreeDateRange');
const jwt = require('jsonwebtoken');

const getCalendarEvents = async (req, res) => {
    const { startDateTime, endDateTime } = req.query;
    const authHeader = req.headers.authorization;
    const microsoftToken = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    const userToken = req.headers['x-user-token'];

    if (!microsoftToken) {
        return res.status(401).json({ error: 'No Microsoft authentication token found' });
    }

    if (!userToken) {
        return res.status(401).json({ error: 'No user authentication token found' });
    }

    try {
        const decoded = jwt.verify(userToken, process.env.JWT_SECRET);

        const graphResponse = await axios.get(`https://graph.microsoft.com/v1.0/me/calendarview?startdatetime=${startDateTime}&enddatetime=${endDateTime}&$select=subject,start,end`, {
            headers: {
                'Authorization': `Bearer ${microsoftToken}`,
                'Content-Type': 'application/json',
            },
        });

        const events = graphResponse.data.value.map(event => ({
            startDate: event.start.dateTime,
            endDate: event.end.dateTime,
        }));

        // Calculate free date ranges
        const freeDateRanges = calculateFreeDateRanges(events, startDateTime, endDateTime);
        
        // Store them in the database
        const freeDateRangeDoc = await FreeDateRange.findOneAndReplace(
            { userId: decoded.id }, // Query condition
            { userId: decoded.id, dateRanges: freeDateRanges }, // New document
            { upsert: true, new: true } // Options: create if not exists and return new doc
        );

        // Return only the free date ranges
        res.json({ freeDateRanges });

    } catch (error) {
        console.error('Error contacting Microsoft Graph API:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Failed to retrieve calendar events", details: error.response ? error.response.data : error.message });
    }
};

function calculateFreeDateRanges(events, startDateTime, endDateTime) {
    let freeDateRanges = [];
    let currentStartDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    events = events.map(event => ({
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
    })).sort((a, b) => a.startDate - b.startDate);

    events.forEach(event => {
        if (currentStartDate < event.startDate) {
            let adjustedEndDate = new Date(event.startDate);
            if (adjustedEndDate > currentStartDate) {
                freeDateRanges.push({
                    startDate: currentStartDate.toISOString().split('T')[0],
                    endDate: adjustedEndDate.toISOString().split('T')[0]
                });
            }
        }
        currentStartDate = new Date(event.endDate.getTime() + (24 * 60 * 60 * 1000));
    });

    if (currentStartDate < endDate) {
        endDate.setDate(endDate.getDate() + 1);
        freeDateRanges.push({
            startDate: currentStartDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        });
    }

    freeDateRanges = freeDateRanges.map(range => ({
        startDate: range.startDate < startDateTime ? startDateTime : range.startDate,
        endDate: range.endDate > endDateTime ? endDateTime : range.endDate
    })).filter(range => {
        const start = new Date(range.startDate);
        const end = new Date(range.endDate);
        return (end - start) / (1000 * 60 * 60 * 24) >= 2;
    });

    return freeDateRanges;
}

module.exports = { getCalendarEvents };

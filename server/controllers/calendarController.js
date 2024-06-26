// controllers/calendarController.js
const axios = require('axios');
const FreeDateRange = require('../models/FreeDateRange');
const jwt = require('jsonwebtoken');


const getCalendarEvents = async (req, res) => {
    const { startDateTime, endDateTime } = req.query;
    const token = req.cookies['microsoftToken']; // Ensure the token is being correctly set in your cookies
    const userToken = req.cookies['token'];

    if (!token) {
        return res.status(401).json({ error: 'No microsoft authentication token found' });
    }

    if (!userToken) {
        return res.status(401).json({ error: 'No user authentication token found' });
    }

    try {
        const decoded = jwt.verify(userToken, process.env.JWT_SECRET);

        const graphResponse = await axios.get(`https://graph.microsoft.com/v1.0/me/calendarview?startdatetime=${startDateTime}&enddatetime=${endDateTime}&$select=subject,start,end`, {
            headers: {
                'Authorization': `Bearer ${token}`,
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
        // Replace existing document for the user or create a new one
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

    // Ensure events are sorted and normalized
    events = events.map(event => ({
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
    })).sort((a, b) => a.startDate - b.startDate);

    // Adjust to the local time zone at the beginning if needed
    events.forEach(event => {
        if (currentStartDate < event.startDate) {
            let adjustedEndDate = new Date(event.startDate);
            adjustedEndDate.setDate(adjustedEndDate.getDate() - 1); // Make end date inclusive of free range
            if (adjustedEndDate >= currentStartDate) { // Include range only if it starts within the input range
                freeDateRanges.push({
                    startDate: currentStartDate.toISOString().split('T')[0],
                    endDate: adjustedEndDate.toISOString().split('T')[0]
                });
            }
        }
        currentStartDate = new Date(event.endDate.getTime() + (24 * 60 * 60 * 1000)); // Move to the day after event ends
    });

    // Check for a final range after the last event
    if (currentStartDate < endDate) {
        endDate.setDate(endDate.getDate() + 1); // Adjust to include the last day in range
        freeDateRanges.push({
            startDate: currentStartDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        });
    }

    // Correcting the range to fit within the specified boundaries
    freeDateRanges = freeDateRanges.map(range => ({
        startDate: range.startDate < startDateTime ? startDateTime : range.startDate,
        endDate: range.endDate > endDateTime ? endDateTime : range.endDate
    })).filter(range => {
        const start = new Date(range.startDate);
        const end = new Date(range.endDate);
        const diffDays = (end - start) / (1000 * 60 * 60 * 24);
        return diffDays >= 3;
    });

    return freeDateRanges;
}



module.exports = { getCalendarEvents };

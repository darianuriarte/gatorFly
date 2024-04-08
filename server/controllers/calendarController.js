// controllers/calendarController.js
const axios = require('axios');

const getCalendarEvents = async (req, res) => {
    const { startDateTime, endDateTime } = req.query;
    const token = req.cookies['microsoftToken'];
  
    if (!token) {
      return res.status(401).json({ error: 'No authentication token found' });
    }
  
    try {
      const graphResponse = await axios.get(`https://graph.microsoft.com/v1.0/me/calendarview?startdatetime=${startDateTime}&enddatetime=${endDateTime}&$select=subject,start,end`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      res.json(graphResponse.data.value);
    } catch (error) {
      console.error('Error contacting Microsoft Graph API:', error.response ? error.response.data : error.message);
      res.status(500).json({ message: "Failed to retrieve calendar events", details: error.response ? error.response.data : error.message });
    }
  };
  

module.exports = { getCalendarEvents };

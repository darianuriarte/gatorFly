// controllers/getUserFreeDateRanges.js
const jwt = require('jsonwebtoken');
const FreeDateRange = require('../models/FreeDateRange');

const getUserFreeDateRanges = async (req, res) => {
    const userToken = req.cookies['token'];

    if (!userToken) {
        return res.status(401).json({ error: 'No user authentication token found' });
    }

    try {
        const decoded = jwt.verify(userToken, process.env.JWT_SECRET);

        // Find the user's free date ranges from the database
        const freeDateRangeDoc = await FreeDateRange.findOne({ userId: decoded.id });

        if (!freeDateRangeDoc) {
            return res.status(404).json({ error: 'No free date ranges found for the user' });
        }

        // Return the user's free date ranges
        res.json({ freeDateRanges: freeDateRangeDoc.dateRanges });

    } catch (error) {
        console.error('Error fetching user\'s free date ranges:', error);
        res.status(500).json({ message: "Failed to retrieve user's free date ranges", details: error.message });
    }
};

module.exports = { getUserFreeDateRanges };
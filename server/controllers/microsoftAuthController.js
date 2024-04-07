// File: controllers/microsoftAuthController.js
const axios = require('axios');
require('dotenv').config();

const handleMicrosoftCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required.' });
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(`https://login.microsoftonline.com/consumers/oauth2/v2.0/token`, new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID,
      scope: 'User.Read',
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
      client_secret: process.env.MICROSOFT_CLIENT_SECRET,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // TODO: Handle the Microsoft account information, possibly by looking up or creating a user in your database

    // Respond with a simplified JSON object (or redirect the user as needed)
    res.json({ success: true, message: "Microsoft authentication successful", data: tokenResponse.data });
  } catch (error) {
    console.error('Error during Microsoft auth callback:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error during Microsoft authentication' });
  }
};

module.exports = { handleMicrosoftCallback };

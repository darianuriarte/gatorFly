const axios = require('axios');
require('dotenv').config();

const handleMicrosoftCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    // Redirect with an error query parameter
    return res.redirect('http://localhost:5173?error=Authorization code is required.');
  }

  try {
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


    // Set the JWT as a cookie
    res.cookie('microsoftToken', tokenResponse.data.access_token, { httpOnly: true,  path: '/home' });

    // Redirect to your frontend application with a success flag or similar
    res.redirect('http://localhost:5173?login=success');
  } catch (error) {
    console.error('Error during Microsoft auth callback:', error.response ? error.response.data : error.message);
    // Redirect with an error query parameter
    res.redirect(`http://localhost:5173?error=Error during Microsoft authentication`);
  }
};

module.exports = { handleMicrosoftCallback };

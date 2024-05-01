const axios = require('axios');
require('dotenv').config();

const handleMicrosoftCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.redirect('https://gatorfly-frontend.onrender.com/calendar?error=Authorization code is required.');
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

    // Passing the token in the URL (careful with security implications)
    const token = encodeURIComponent(tokenResponse.data.access_token);
    res.redirect(`https://gatorfly-frontend.onrender.com/calendar?login=success&token=${token}`);
  } catch (error) {
    console.error('Error during Microsoft auth callback:', error.response ? error.response.data : error.message);
    res.redirect(`https://gatorfly-frontend.onrender.com/calendar?error=Error during Microsoft authentication`);
  }
};


module.exports = { handleMicrosoftCallback };

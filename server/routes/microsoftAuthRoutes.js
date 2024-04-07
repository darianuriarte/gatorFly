// File: routes/microsoftAuthRoutes.js
const express = require('express');

const { handleMicrosoftCallback } = require('../controllers/microsoftAuthController');

const router = express.Router();

router.get('/auth/microsoft/callback', handleMicrosoftCallback);

module.exports = router;

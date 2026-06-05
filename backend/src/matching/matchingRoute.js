const express = require('express');
const { auth, requireRole } = require('../../middleware/authorisation');;
const { getMatchedDonations } = require('./matchingController');

const router = express.Router();

router.get('/donations', auth, requireRole('volunteer'), getMatchedDonations);

module.exports = router;
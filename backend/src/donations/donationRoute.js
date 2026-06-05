const express = require('express');
const { auth, requireRole } = require('../../middleware/authorisation');
const { createDonation, getDonations, acceptDonation, completeDonation, cancelDonation } = require('./donationController');
const router = express.Router();

router.post('/', auth, requireRole('donor'), createDonation);
router.get('/', auth, getDonations);
router.post('/:id/accept', auth, requireRole('volunteer'), acceptDonation);
router.post('/:id/complete', auth, requireRole('volunteer'), completeDonation);
router.post('/:id/cancel', auth, requireRole('donor'), cancelDonation);
router.put('/:id/cancel', auth, requireRole('donor'), cancelDonation);

module.exports = router;
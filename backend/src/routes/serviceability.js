// src/routes/serviceability.js
const router = require('express').Router();
const serviceabilityController = require('../controllers/serviceabilityController');

// Public — no auth needed, users can check before logging in
router.get('/:pincode', serviceabilityController.checkServiceability);

module.exports = router;

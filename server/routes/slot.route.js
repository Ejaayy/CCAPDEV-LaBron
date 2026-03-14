const express = require('express');
const router = express.Router();
const slotController = require('../controller/slot.controller');

//GET /api/slots?date=YYYY-MM-DD
router.get('/', slotController.getAvailableSlots);

module.exports = router;
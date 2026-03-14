const express = require('express');
const router = express.Router();
const slotController = require('../controller/slot.controller');

router.get('/:id/occupancy', slotController.getSlotOccupancy);  

//GET /api/slots?date=YYYY-MM-DD
router.get('/', slotController.getAvailableSlots);
router.get('/overview', slotController.getWeeklyOverview);

module.exports = router;
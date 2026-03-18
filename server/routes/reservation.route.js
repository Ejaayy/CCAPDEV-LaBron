const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');

router.post('/', reservationController.createReservation);
router.get('/reserved-dates', reservationController.getReservedDates);

router.get('/my-reserved-dates', reservationController.getMyReservedDates);

module.exports = router;
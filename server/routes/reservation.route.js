const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');

router.post('/', reservationController.createReservation);
router.get('/reserved-dates', reservationController.getReservedDates);

router.get('/my-reservations', reservationController.getMyReservations);
router.get('/my-stats', reservationController.getMyStats);

router.get('/available-stats', reservationController.getAvailabilityStats);
router.get('/user/:id', reservationController.getUserPublicReservations);
router.delete('/:reservationId/no-show', reservationController.cancelNoShowReservation);
router.delete('/:reservationId', reservationController.deleteReservation);

module.exports = router;

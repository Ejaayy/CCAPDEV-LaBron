const reservationService = require('../services/reservation.service');

exports.getReservedDates = async (req, res) => {
    try {
        const reservedDates = await reservationService.getReservedDates();
        res.status(200).json(reservedDates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createReservation = async (req, res) => {
    try {
        const reservation = await reservationService.createReservation(req.body);
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
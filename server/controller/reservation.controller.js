
const reservationService = require('../services/reservation.service');

exports.createReservation = async (req, res) => {
    try {
        const reservation = await reservationService.create(req.body);
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
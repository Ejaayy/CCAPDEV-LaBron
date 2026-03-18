const reservationService = require('../services/reservation.service');

exports.createReservation = async (req, res) => {
    try {
        const reservation = await reservationService.createReservation(req.body);
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getReservedDates = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(401).json({ message: "No logged-in user found" });
        }

        const reservedDates = await reservationService.getReservedDates(userId);
        res.status(200).json(reservedDates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
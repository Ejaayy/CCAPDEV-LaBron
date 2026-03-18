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

exports.getMyReservations = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: Please log in." });
        }

        const reservations = await reservationService.getUserReservations(userId);
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyStats = async (req, res) => {
    try {
        const userId = req.session.userId;
        
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: Please log in." });
        }

        const stats = await reservationService.getUserStats(userId);
        res.status(200).json(stats);
    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({ message: "Failed to fetch user stats." });
    }
};
const reservationService = require('../services/reservation.service');
const Reservation = require('../model/reservation.model');

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

exports.getUserPublicReservations = async (req, res) => {
    try {
        const targetUserId = req.params.id;

        // reservations with privacy
        const reservations = await Reservation.find({
            reservedFor: targetUserId,
            isAnonymous: false // hides anonymous bookings
        }).populate({
            path: 'slots.slot',
            populate: { path: 'lab' }
        }).sort({ createdAt: -1 });

        // formatting
        const formattedReservations = reservations.flatMap(reservation => {
            return reservation.slots.map(s => {
                const slotData = s.slot;
                const labData = slotData?.lab;

                return {
                    id: reservation._id,
                    status: reservation.status,
                    laboratory: labData ? labData.name : "Unknown Lab",
                    seatNumber: s.seat,
                    reservationTime: slotData ? `${slotData.startTime} - ${slotData.endTime}` : "N/A",
                    rawDate: slotData ? slotData.date : null
                };
            });
        });

        res.status(200).json(formattedReservations);
    } catch (error) {
        console.error("Error fetching public reservations:", error);
        res.status(500).json({ message: "Internal server error" });
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

exports.getAvailabilityStats = async (req, res) => {
    try {
        const stats = await reservationService.getAvailabilityStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error("Error fetching availability stats:", error);
        res.status(500).json({ message: "Failed to fetch availability stats." });       
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;

        const result = await Reservation.findByIdAndUpdate(
            reservationId,
            { status: "cancelled" },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.status(200).json({ message: "Reservation removed successfully" });
    } catch (error) {
        console.error("Delete reservation error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.cancelNoShowReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;

        const result = await reservationService.cancelNoShowReservation(reservationId, {
            userId: req.session.userId,
            role: req.session.role,
        });

        res.status(200).json({
            message: "Reservation cancelled as no-show.",
            reservationId: result._id,
        });
    } catch (error) {
        const status = error.message === "Reservation not found" ? 404 : 400;
        res.status(status).json({ message: error.message });
    }
};

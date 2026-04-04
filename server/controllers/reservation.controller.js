const reservationService = require('../services/reservation.service');
const emailService = require('../services/email.service'); 
const User = require('../model/User');
const Reservation = require('../model/reservation.model');

exports.createReservation = async (req, res) => {
    try {
        
        const reservation = await reservationService.createReservation(req.body);
        res.status(201).json(reservation);

        // EMAIL PROCESSING 
        // Fetch the user's email address
        const user = await User.findById(req.body.reservedFor);

        const populatedReservation = await Reservation.findById(reservation._id).populate({
            path: 'slots.slot',
            populate: { path: 'lab' }
        });

        if (user && user.email && populatedReservation && populatedReservation.slots.length > 0) {
            const firstSlot = populatedReservation.slots[0].slot;
            
            // Format the time 
            const formatTime12h = (time24) => {
                if (!time24) return "N/A";
                const [hour, minute] = time24.split(':');
                const h = parseInt(hour, 10);
                const ampm = h >= 12 ? 'PM' : 'AM';
                const h12 = h % 12 || 12;
                return `${h12.toString().padStart(2, '0')}:${minute} ${ampm}`;
            };

            const timeString = `${formatTime12h(firstSlot.startTime)} - ${formatTime12h(firstSlot.endTime)}`;
            const seatString = populatedReservation.slots.map(s => s.seat).join(", ");

            // Fire email
            emailService.sendConfirmationEmail(user.email, {
                laboratory: firstSlot.lab ? firstSlot.lab.name : "Unknown Lab",
                rawDate: firstSlot.date,
                reservationTime: timeString,
                seats: seatString
            });
        }
        
    } catch (error) {
        if (!res.headersSent) {
            res.status(400).json({ message: error.message });
        }
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

exports.addSeatsToReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const { seats } = req.body; 

        if (!seats || !Array.isArray(seats)) {
            return res.status(400).json({ message: "Invalid seats format. Expected an array." });
        }

        const updatedReservation = await reservationService.addSeats(reservationId, seats);
        
        res.status(200).json({ message: "Seats updated successfully", reservation: updatedReservation });

        // Fetch the user email 
        const user = await User.findById(updatedReservation.reservedFor);

        const populatedReservation = await Reservation.findById(updatedReservation._id).populate({
            path: 'slots.slot',
            populate: { path: 'lab' }
        });

        if (user && user.email && populatedReservation && populatedReservation.slots.length > 0) {
            const firstSlot = populatedReservation.slots[0].slot;
            
            const formatTime12h = (time24) => {
                if (!time24) return "N/A";
                const [hour, minute] = time24.split(':');
                const h = parseInt(hour, 10);
                const ampm = h >= 12 ? 'PM' : 'AM';
                return `${(h % 12 || 12).toString().padStart(2, '0')}:${minute} ${ampm}`;
            };

            const timeString = `${formatTime12h(firstSlot.startTime)} - ${formatTime12h(firstSlot.endTime)}`;
            const seatString = populatedReservation.slots.map(s => s.seat).join(", ");

            emailService.sendUpdateEmail(user.email, {
                laboratory: firstSlot.lab ? firstSlot.lab.name : "Unknown Lab",
                rawDate: firstSlot.date,
                reservationTime: timeString,
                seats: seatString
            });
        }

    } catch (error) {
        if (!res.headersSent) {
            console.error("Update seats error:", error);
            res.status(500).json({ message: error.message });
        }
    }
};
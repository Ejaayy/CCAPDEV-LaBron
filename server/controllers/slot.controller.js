const slotService = require('../services/slot.service');

exports.getAvailableSlots = async (req, res) => {
    try {
        const { date, all } = req.query; // format: 2026-03-15, all=true for manage page
        if (!date) {
            return res.status(400).json({ message: "Date parameter is required" });
        }

        const includeBlocked = all === "true";
        const slots = await slotService.getSlotsByDate(date, includeBlocked);
        res.status(200).json(slots);
    } catch (error) {
       res.status(500).json({ message: error.message, stack: error.stack });
    }
};

exports.getWeeklyOverview = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const overview = await slotService.getWeeklyCount(today, 7);
        res.status(200).json(overview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSlotOccupancy = async (req, res) => {
    try {
        const { id } = req.params;
        const { details } = req.query;

        if (details === "true") {
            const result = await slotService.getSlotReservationDetails(id);
            return res.status(200).json(result);
        }

        const occupiedSeats = await slotService.getReservedSeatsForSlot(id);
        res.status(200).json(occupiedSeats);
    } catch (error) {
        console.error("Occupancy Error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.createSlot = async (req, res) => {
    try {
        const { lab, date, startTime, endTime } = req.body;
        if (!lab || !date || !startTime || !endTime) {
            return res.status(400).json({
                message: "lab, date, startTime, and endTime are required",
            });
        }
        const slot = await slotService.createSlot({
            lab,
            date,
            startTime,
            endTime,
        });
        res.status(201).json(slot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const { isAvailable } = req.body;
        if (typeof isAvailable !== "boolean") {
            return res.status(400).json({ message: "isAvailable (boolean) is required" });
        }
        const slot = await slotService.updateSlotAvailability(id, isAvailable);
        if (!slot) {
            return res.status(404).json({ message: "Slot not found" });
        }
        res.status(200).json(slot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

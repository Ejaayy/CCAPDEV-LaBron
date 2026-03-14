const slotService = require('../services/slot.service');

exports.getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.query; // format: 2026-03-15
        if (!date) {
            return res.status(400).json({ message: "Date parameter is required" });
        }
        
        const slots = await slotService.getSlotsByDate(date);
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
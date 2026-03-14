const Slot = require('../model/slot.model');

exports.getSlotsByDate = async (requestedDate) => {
    return await Slot.find({ 
        date: requestedDate, 
        isAvailable: true 
    }).populate('lab');
};

exports.createSlot = async (slotData) => {
    const slot = new Slot(slotData);
    return await slot.save();
};

exports.getWeeklyCount = async (startDate, daysCount = 7) => {
    const results = [];
    
    for (let i = 0; i < daysCount; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const isoDate = date.toISOString().split('T')[0];

        // count items in db with specific date
        const count = await Slot.countDocuments({ 
            date: isoDate, 
            isAvailable: true 
        });

        results.push({
            date: isoDate,
            count: count
        });
    }
    return results;
};
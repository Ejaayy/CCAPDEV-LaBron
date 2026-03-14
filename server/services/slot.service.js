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
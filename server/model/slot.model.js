const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    lab: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Lab", 
        required: true 
    },
    date: { 
        type: String, // Store as YYYY-MM-DD 
        required: true 
    },
    startTime: { 
        type: String, // format: "09:00"
        required: true 
    },
    endTime: { 
        type: String, // format: "11:00"
        required: true 
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Slot", slotSchema);
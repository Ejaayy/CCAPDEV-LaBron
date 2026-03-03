const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
    {
        lab: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Lab", 
            required: true 
        },
        seat: { 
            type: String, 
            required: true 
        },

        startTime: { 
            type: Date, 
            required: true 
        },
        endTime: { 
            type: Date, 
            required: true 
        },

        isReserved: { 
            type: Boolean, 
            default: false 
        },

        reservation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reservation",
            default: null
        }  
    },
    {timestamps: true }
);

module.exports = mongoose.model("Slot", slotSchema);
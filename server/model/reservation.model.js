const mongoose = require("mongoose");

const reservedSlotSchema = new mongoose.Schema(
    {
        slot: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Slot", 
            required: true 
        },
        seat: { 
            type: String, 
            required: true 
        }
    },
    { _id: false }
);

const reservationSchema = new mongoose.Schema(
    {
        reservedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        reservedFor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true  
        },
        slots: {
            type: [reservedSlotSchema],
            required: true
        },
        isAnonymous: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ["active", "ongoing", "cancelled", "completed"],
            default: "active"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
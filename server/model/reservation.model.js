const mongoose = require("mongoose");

const reservedSlotSchema = new mongoose.Schema(
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
            enum: ["active", "cancelled", "completed"],
            default: "active"
        }
    },
    {timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
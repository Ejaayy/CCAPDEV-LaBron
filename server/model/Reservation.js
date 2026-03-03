const mongoose = require("mongoose");

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

        slots: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Slot",
        }],

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
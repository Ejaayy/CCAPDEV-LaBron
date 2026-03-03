const mongoose = require("mongoose");

const labSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
            unique: true 
        },                                          //G302B, Y302C, etc.
        location: { 
            type: String, 
            default: "" 
        },                                         //Gokongwei, Yuchengco, etc.
        seatCount: { 
            type: Number, 
            required: true 
        },          
        seats: { 
            type: [String], 
            required: true,
        }                           // ["A1", "A2", "B1", "B2", ...]
    },
    {timestamps: true }
);

module.exports = mongoose.model("Lab", labSchema);